import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FreelanceMarketplaceService } from '../../../services/freelance.service';
import { Order, FreelanceService } from '../../../models/freelance.model';

@Component({
  selector: 'app-freelancer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
        <div class="container mx-auto px-4 py-8">
          <h1 class="text-3xl font-bold mb-2">Freelancer Dashboard</h1>
          <p class="text-teal-100">Manage your services, orders, and earnings</p>
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
                @if (stat.trend) {
                  <span class="text-sm" [class.text-green-600]="stat.trend > 0"
                        [class.text-red-600]="stat.trend < 0">
                    {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
                  </span>
                }
              </div>
              <div class="text-2xl font-bold text-gray-800">{{ stat.value }}</div>
              <div class="text-sm text-gray-600">{{ stat.label }}</div>
            </div>
          }
        </div>
      </div>

      <div class="container mx-auto px-4 pb-8">
        <!-- Tabs -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
          <div class="border-b">
            <nav class="flex">
              @for (tab of tabs; track tab.id) {
                <button (click)="activeTab = tab.id"
                        [class.border-b-2]="activeTab === tab.id"
                        [class.border-teal-600]="activeTab === tab.id"
                        [class.text-teal-600]="activeTab === tab.id"
                        class="px-6 py-4 font-medium hover:text-teal-600 transition-colors">
                  {{ tab.label }}
                  @if (tab.count) {
                    <span class="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {{ tab.count }}
                    </span>
                  }
                </button>
              }
            </nav>
          </div>
        </div>

        <!-- Tab Content -->
        <div [ngSwitch]="activeTab">
          <!-- Overview Tab -->
          <div *ngSwitchCase="'overview'" class="grid lg:grid-cols-3 gap-6">
            <!-- Active Orders -->
            <div class="lg:col-span-2">
              <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-xl font-semibold">Active Orders</h2>
                  <a routerLink="/manage-orders" class="text-teal-600 hover:text-teal-700 text-sm">
                    View All →
                  </a>
                </div>

                @if (activeOrders.length > 0) {
                  <div class="space-y-4">
                    @for (order of activeOrders.slice(0, 3); track order.id) {
                      <div class="border rounded-lg p-4 hover:border-teal-500 transition-colors cursor-pointer"
                           [routerLink]="['/order', order.id]">
                        <div class="flex justify-between items-start mb-2">
                          <div>
                            <h4 class="font-semibold text-gray-800">{{ order.title }}</h4>
                            <p class="text-sm text-gray-600">Client: {{ order.clientName }}</p>
                          </div>
                          <span class="px-2 py-1 text-xs font-semibold rounded"
                                [class.bg-blue-100]="order.status === 'active'"
                                [class.text-blue-600]="order.status === 'active'"
                                [class.bg-yellow-100]="order.status === 'revision'"
                                [class.text-yellow-600]="order.status === 'revision'"
                                [class.bg-green-100]="order.status === 'delivered'"
                                [class.text-green-600]="order.status === 'delivered'">
                            {{ order.status }}
                          </span>
                        </div>
                        <div class="flex justify-between items-center text-sm">
                          <span class="text-gray-500">
                            Due: {{ formatDate(order.deliveryDate) }}
                          </span>
                          <span class="font-semibold text-teal-600">\${{ order.totalAmount }}</span>
                        </div>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="text-center py-8 text-gray-500">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    <p>No active orders at the moment</p>
                  </div>
                }
              </div>

              <!-- Recent Activity -->
              <div class="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
                <div class="space-y-3">
                  @for (activity of recentActivity; track activity.id) {
                    <div class="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div class="w-2 h-2 rounded-full mt-2"
                           [class.bg-green-500]="activity.type === 'order'"
                           [class.bg-blue-500]="activity.type === 'message'"
                           [class.bg-yellow-500]="activity.type === 'review'"></div>
                      <div class="flex-1">
                        <p class="text-sm text-gray-800">{{ activity.description }}</p>
                        <p class="text-xs text-gray-500">{{ activity.time }}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1">
              <!-- Earnings Card -->
              <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 class="font-semibold mb-4">Earnings</h3>
                <div class="space-y-3">
                  <div>
                    <p class="text-sm text-gray-600">Available for withdrawal</p>
                    <p class="text-2xl font-bold text-green-600">\${{ earnings.available }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Pending clearance</p>
                    <p class="text-xl font-semibold text-yellow-600">\${{ earnings.pending }}</p>
                  </div>
                  <div class="pt-3 border-t">
                    <p class="text-sm text-gray-600">Total earnings</p>
                    <p class="text-xl font-semibold">\${{ earnings.total }}</p>
                  </div>
                  <button class="w-full mt-3 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors">
                    Withdraw Funds
                  </button>
                </div>
              </div>

              <!-- Response Time -->
              <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 class="font-semibold mb-4">Response Time</h3>
                <div class="text-center">
                  <div class="w-24 h-24 mx-auto mb-3 relative">
                    <svg class="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="#e5e7eb" stroke-width="8" fill="none"/>
                      <circle cx="48" cy="48" r="40" stroke="#10b981" stroke-width="8" fill="none"
                              stroke-dasharray="251.2" [attr.stroke-dashoffset]="251.2 * (1 - responseTime.percentage / 100)"/>
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                      <span class="text-2xl font-bold">{{ responseTime.percentage }}%</span>
                    </div>
                  </div>
                  <p class="text-sm text-gray-600">Avg. response: {{ responseTime.average }}</p>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="font-semibold mb-4">Quick Actions</h3>
                <div class="space-y-2">
                  <button routerLink="/create-service"
                          class="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div class="flex items-center gap-3">
                      <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      <span class="font-medium">Create New Service</span>
                    </div>
                  </button>
                  <button routerLink="/projects"
                          class="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div class="flex items-center gap-3">
                      <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                      <span class="font-medium">Browse Projects</span>
                    </div>
                  </button>
                  <button routerLink="/portfolio"
                          class="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div class="flex items-center gap-3">
                      <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                      </svg>
                      <span class="font-medium">Update Portfolio</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Services Tab -->
          <div *ngSwitchCase="'services'">
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">My Services</h2>
                <button routerLink="/create-service"
                        class="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                  + Create New Service
                </button>
              </div>

              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (service of myServices; track service.id) {
                  <div class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="aspect-video bg-gradient-to-br from-teal-400 to-emerald-500"></div>
                    <div class="p-4">
                      <h3 class="font-semibold mb-2">{{ service.title }}</h3>
                      <div class="flex justify-between items-center text-sm text-gray-600 mb-3">
                        <span>{{ service.totalOrders }} orders</span>
                        <span>{{ service.inQueue }} in queue</span>
                      </div>
                      <div class="flex gap-2">
                        <button class="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50">
                          Edit
                        </button>
                        <button class="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50">
                          {{ service.status === 'active' ? 'Pause' : 'Activate' }}
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Analytics Tab -->
          <div *ngSwitchCase="'analytics'">
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Performance Chart -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4">Performance Overview</h2>
                <div class="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                  Chart Placeholder
                </div>
              </div>

              <!-- Top Services -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4">Top Performing Services</h2>
                <div class="space-y-3">
                  @for (service of topServices; track service.id) {
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p class="font-medium">{{ service.title }}</p>
                        <p class="text-sm text-gray-600">{{ service.orders }} orders</p>
                      </div>
                      <span class="text-lg font-bold text-teal-600">\${{ service.revenue }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Messages Tab -->
          <div *ngSwitchCase="'messages'">
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold mb-4">Messages</h2>
              <div class="space-y-3">
                @for (message of messages; track message.id) {
                  <div class="flex items-start gap-3 p-4 hover:bg-gray-50 rounded cursor-pointer">
                    <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <div>
                          <p class="font-medium">{{ message.sender }}</p>
                          <p class="text-sm text-gray-600">{{ message.preview }}</p>
                        </div>
                        <span class="text-xs text-gray-500">{{ message.time }}</span>
                      </div>
                    </div>
                    @if (message.unread) {
                      <div class="w-2 h-2 bg-teal-600 rounded-full"></div>
                    }
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
export class FreelancerDashboardComponent implements OnInit {
  activeTab = 'overview';
  activeOrders: Order[] = [];
  myServices: FreelanceService[] = [];

  stats = [
    {
      label: 'Total Earnings',
      value: '\$12,450',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      trend: 12
    },
    {
      label: 'Active Orders',
      value: '5',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: -5
    },
    {
      label: 'Completion Rate',
      value: '98%',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      trend: 2
    },
    {
      label: 'Avg. Rating',
      value: '4.9',
      icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      trend: 0
    }
  ];

  tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'services', label: 'Services', count: 3 },
    { id: 'analytics', label: 'Analytics' },
    { id: 'messages', label: 'Messages', count: 2 }
  ];

  recentActivity = [
    { id: 1, type: 'order', description: 'New order received for Logo Design', time: '2 hours ago' },
    { id: 2, type: 'message', description: 'Client messaged about Web Development project', time: '5 hours ago' },
    { id: 3, type: 'review', description: 'Received 5-star review from John Doe', time: '1 day ago' },
    { id: 4, type: 'order', description: 'Order completed for Content Writing', time: '2 days ago' }
  ];

  earnings = {
    available: 2450,
    pending: 450,
    total: 12450
  };

  responseTime = {
    percentage: 95,
    average: '1 hour'
  };

  topServices = [
    { id: 1, title: 'Professional Logo Design', orders: 45, revenue: 2250 },
    { id: 2, title: 'WordPress Development', orders: 23, revenue: 4600 },
    { id: 3, title: 'SEO Content Writing', orders: 67, revenue: 3350 }
  ];

  messages = [
    { id: 1, sender: 'John Smith', preview: 'Hi, I need some changes to the logo...', time: '10m ago', unread: true },
    { id: 2, sender: 'Sarah Johnson', preview: 'Thanks for the quick delivery!', time: '2h ago', unread: true },
    { id: 3, sender: 'Mike Wilson', preview: 'Can you provide a quote for...', time: '5h ago', unread: false }
  ];

  constructor(private freelanceService: FreelanceMarketplaceService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load active orders
    this.freelanceService.getOrders('f1', 'freelancer').subscribe(orders => {
      this.activeOrders = orders.filter(o => o.status === 'active' || o.status === 'pending');
    });

    // Load services
    this.freelanceService.getFreelanceServices().subscribe(services => {
      this.myServices = services.filter(s => s.freelancerId === 'f1');
    });
  }

  formatDate(date: Date): string {
    const days = Math.floor((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  }
}
