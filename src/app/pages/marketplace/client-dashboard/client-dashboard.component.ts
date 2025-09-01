import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FreelanceMarketplaceService } from '../../../services/freelance.service';
import { Project, Order } from '../../../models/freelance.model';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div class="container mx-auto px-4 py-8">
          <h1 class="text-3xl font-bold mb-2">Client Dashboard</h1>
          <p class="text-purple-100">Manage your projects and hired freelancers</p>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="container mx-auto px-4 -mt-8">
        <div class="grid md:grid-cols-4 gap-6 mb-8">
          @for (stat of stats; track stat.label) {
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center justify-between mb-2">
                <div class="w-12 h-12 rounded-full flex items-center justify-center"
                     [class]="stat.bgColor">
                  <svg class="w-6 h-6" [class]="stat.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="stat.icon"/>
                  </svg>
                </div>
              </div>
              <div class="text-2xl font-bold text-gray-800">{{ stat.value }}</div>
              <div class="text-sm text-gray-600">{{ stat.label }}</div>
            </div>
          }
        </div>
      </div>

      <div class="container mx-auto px-4 pb-8">
        <div class="grid lg:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <!-- Active Projects -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Active Projects</h2>
                <a routerLink="/post-project" class="text-indigo-600 hover:text-indigo-700 text-sm">
                  Post New Project →
                </a>
              </div>

              @if (activeProjects.length > 0) {
                <div class="space-y-4">
                  @for (project of activeProjects; track project.id) {
                    <div class="border rounded-lg p-4 hover:border-indigo-500 transition-colors">
                      <div class="flex justify-between items-start mb-2">
                        <div>
                          <h4 class="font-semibold text-gray-800">{{ project.title }}</h4>
                          <p class="text-sm text-gray-600">{{ project.proposals }} proposals received</p>
                        </div>
                        <span class="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded">
                          {{ project.status }}
                        </span>
                      </div>
                      <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-500">
                          Budget: \${{ project.budget.min }}-\${{ project.budget.max }}
                        </span>
                        <button [routerLink]="['/project', project.id]"
                                class="text-indigo-600 hover:text-indigo-700">
                          View Details →
                        </button>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="text-center py-8 text-gray-500">
                  <p>No active projects</p>
                  <button routerLink="/post-project"
                          class="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                    Post Your First Project
                  </button>
                </div>
              }
            </div>

            <!-- Active Orders -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Active Orders</h2>
                <a routerLink="/manage-orders" class="text-indigo-600 hover:text-indigo-700 text-sm">
                  View All →
                </a>
              </div>

              @if (activeOrders.length > 0) {
                <div class="space-y-4">
                  @for (order of activeOrders; track order.id) {
                    <div class="border rounded-lg p-4">
                      <div class="flex justify-between items-start mb-2">
                        <div>
                          <h4 class="font-semibold text-gray-800">{{ order.title }}</h4>
                          <p class="text-sm text-gray-600">Freelancer: {{ order.freelancerName }}</p>
                        </div>
                        <span class="px-2 py-1 text-xs font-semibold rounded"
                              [class.bg-blue-100]="order.status === 'active'"
                              [class.text-blue-600]="order.status === 'active'"
                              [class.bg-green-100]="order.status === 'delivered'"
                              [class.text-green-600]="order.status === 'delivered'">
                          {{ order.status }}
                        </span>
                      </div>
                      <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-500">
                          Due: {{ formatDate(order.deliveryDate) }}
                        </span>
                        <span class="font-semibold text-indigo-600">\${{ order.totalAmount }}</span>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="text-center py-8 text-gray-500">
                  <p>No active orders</p>
                </div>
              }
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <!-- Spending Overview -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 class="font-semibold mb-4">Spending Overview</h3>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-600">Total Spent</p>
                  <p class="text-2xl font-bold text-gray-800">\${{ spending.total }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">This Month</p>
                  <p class="text-xl font-semibold text-indigo-600">\${{ spending.thisMonth }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Active Contracts</p>
                  <p class="text-xl font-semibold">{{ spending.activeContracts }}</p>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 class="font-semibold mb-4">Quick Actions</h3>
              <div class="space-y-2">
                <button routerLink="/post-project"
                        class="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    <span class="font-medium">Post New Project</span>
                  </div>
                </button>
                <button routerLink="/services"
                        class="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <span class="font-medium">Browse Services</span>
                  </div>
                </button>
                <button routerLink="/messages"
                        class="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    <span class="font-medium">Messages</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Recommended Freelancers -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="font-semibold mb-4">Recommended Freelancers</h3>
              <div class="space-y-3">
                @for (freelancer of recommendedFreelancers; track freelancer.id) {
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {{ freelancer.avatar }}
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-sm">{{ freelancer.name }}</p>
                      <p class="text-xs text-gray-600">{{ freelancer.skills }}</p>
                    </div>
                    <div class="text-right">
                      <div class="flex items-center gap-1">
                        <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span class="text-xs">{{ freelancer.rating }}</span>
                      </div>
                      <p class="text-xs text-gray-500">\${{ freelancer.rate }}/hr</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ClientDashboardComponent implements OnInit {
  activeProjects: Project[] = [];
  activeOrders: Order[] = [];

  stats = [
    {
      label: 'Active Projects',
      value: '3',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Total Spent',
      value: '\$8,450',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      label: 'Freelancers Hired',
      value: '12',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Avg. Rating Given',
      value: '4.8',
      icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  ];

  spending = {
    total: 8450,
    thisMonth: 1250,
    activeContracts: 3
  };

  recommendedFreelancers = [
    { id: 1, name: 'Sarah Designer', avatar: 'SD', skills: 'UI/UX Design', rating: 4.9, rate: 65 },
    { id: 2, name: 'John Developer', avatar: 'JD', skills: 'Full Stack', rating: 4.8, rate: 85 },
    { id: 3, name: 'Emma Writer', avatar: 'EW', skills: 'Content Writing', rating: 4.7, rate: 45 }
  ];

  constructor(private freelanceService: FreelanceMarketplaceService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load projects
    this.freelanceService.getProjects().subscribe(projects => {
      this.activeProjects = projects.filter(p => p.clientId === 'c1' && p.status === 'open');
    });

    // Load orders
    this.freelanceService.getOrders('c1', 'client').subscribe(orders => {
      this.activeOrders = orders.filter(o => o.status === 'active' || o.status === 'delivered');
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
