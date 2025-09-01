import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessagingService, Conversation, Message } from '../../services/messaging.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <div class="flex h-screen">
          <!-- Conversations List -->
          <div class="w-1/3 bg-white border-r border-gray-200">
            <div class="p-4 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Messages</h2>
              <div class="mt-3 relative">
                <input type="text"
                       [(ngModel)]="searchTerm"
                       placeholder="Search conversations..."
                       class="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            <div class="overflow-y-auto" style="height: calc(100vh - 140px);">
              <div *ngFor="let conversation of filteredConversations()"
                   (click)="selectConversation(conversation)"
                   [class.bg-blue-50]="selectedConversation()?.id === conversation.id"
                   class="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span class="text-blue-600 font-semibold">
                        {{ getEmployerInitials(conversation) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-3 flex-1 min-w-0">
                    <div class="flex justify-between items-start">
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {{ getEmployerName(conversation) }}
                        </p>
                        <p class="text-xs text-gray-500">{{ conversation.jobTitle }}</p>
                      </div>
                      <div class="flex flex-col items-end">
                        <p class="text-xs text-gray-500">
                          {{ formatMessageTime(conversation.lastMessage.timestamp) }}
                        </p>
                        <span *ngIf="conversation.unreadCount > 0"
                              class="mt-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                          {{ conversation.unreadCount }}
                        </span>
                      </div>
                    </div>
                    <p class="mt-1 text-sm text-gray-600 truncate">
                      <span *ngIf="conversation.lastMessage.senderId === 'user1'" class="text-gray-500">You: </span>
                      {{ conversation.lastMessage.content }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Area -->
          <div class="flex-1 flex flex-col">
            <!-- Chat Header -->
            <div *ngIf="selectedConversation()" class="bg-white px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 font-semibold text-sm">
                      {{ getEmployerInitials(selectedConversation()!) }}
                    </span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">
                      {{ getEmployerName(selectedConversation()!) }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ selectedConversation()!.jobTitle }} • {{ selectedConversation()!.company }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button class="p-2 text-gray-400 hover:text-gray-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                  <button (click)="deleteConversation()" class="p-2 text-gray-400 hover:text-gray-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Messages -->
            <div *ngIf="selectedConversation()" class="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div class="space-y-4">
                <div *ngFor="let message of messages()"
                     [class.flex]="true"
                     [class.justify-end]="message.senderId === 'user1'">
                  <div [class.max-w-xs]="true"
                       [class.lg:max-w-md]="true">
                    <!-- Special message types -->
                    <div *ngIf="message.type === 'interview-invite'"
                         class="bg-purple-100 rounded-lg p-4 border border-purple-200">
                      <div class="flex items-center mb-2">
                        <svg class="h-5 w-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span class="text-sm font-semibold text-purple-800">Interview Invitation</span>
                      </div>
                      <p class="text-sm text-purple-900">{{ message.content }}</p>
                      <button class="mt-3 w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700">
                        Schedule Interview
                      </button>
                    </div>

                    <div *ngIf="message.type === 'offer'"
                         class="bg-green-100 rounded-lg p-4 border border-green-200">
                      <div class="flex items-center mb-2">
                        <svg class="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="text-sm font-semibold text-green-800">Job Offer</span>
                      </div>
                      <p class="text-sm text-green-900">{{ message.content }}</p>
                      <div class="mt-3 flex space-x-2">
                        <button class="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700">
                          View Offer
                        </button>
                        <button class="flex-1 px-4 py-2 bg-white text-green-600 border border-green-600 text-sm font-medium rounded hover:bg-green-50">
                          Discuss
                        </button>
                      </div>
                    </div>

                    <!-- Regular text message -->
                    <div *ngIf="message.type === 'text'"
                         [class.bg-blue-600]="message.senderId === 'user1'"
                         [class.text-white]="message.senderId === 'user1'"
                         [class.bg-white]="message.senderId !== 'user1'"
                         [class.text-gray-900]="message.senderId !== 'user1'"
                         class="rounded-lg px-4 py-2 shadow">
                      <p class="text-sm">{{ message.content }}</p>
                    </div>

                    <p class="text-xs mt-1"
                       [class.text-right]="message.senderId === 'user1'"
                       [class.text-gray-500]="true">
                      {{ message.timestamp | date:'short' }}
                      <span *ngIf="message.senderId === 'user1' && message.read" class="ml-1">✓✓</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Input Area -->
            <div *ngIf="selectedConversation()" class="bg-white px-6 py-4 border-t border-gray-200">
              <div class="flex items-end space-x-2">
                <button class="p-2 text-gray-400 hover:text-gray-600">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                  </svg>
                </button>
                <div class="flex-1">
                  <textarea
                    [(ngModel)]="newMessage"
                    (keydown.enter)="handleEnterKey($event)"
                    placeholder="Type a message..."
                    rows="1"
                    class="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                  </textarea>
                </div>
                <button (click)="sendMessage()"
                        [disabled]="!newMessage.trim()"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="!selectedConversation()" class="flex-1 flex items-center justify-center bg-gray-50">
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
                <p class="mt-1 text-sm text-gray-500">Choose a conversation from the list to start messaging.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MessagesComponent implements OnInit {
  conversations = signal<Conversation[]>([]);
  selectedConversation = signal<Conversation | null>(null);
  messages = signal<Message[]>([]);
  searchTerm = '';
  newMessage = '';

  filteredConversations = computed(() => {
    const term = this.searchTerm.toLowerCase();
    if (!term) return this.conversations();

    return this.conversations().filter(conv => {
      const employer = conv.participants.find(p => p.role === 'employer');
      return employer?.name.toLowerCase().includes(term) ||
             conv.jobTitle?.toLowerCase().includes(term) ||
             conv.company?.toLowerCase().includes(term);
    });
  });

  constructor(private messagingService: MessagingService) {}

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations(): void {
    this.messagingService.getConversations().subscribe(conversations => {
      this.conversations.set(conversations);
      if (conversations.length > 0 && !this.selectedConversation()) {
        this.selectConversation(conversations[0]);
      }
    });
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversation.set(conversation);
    this.loadMessages(conversation.id);
    this.messagingService.markAsRead(conversation.id).subscribe(() => {
      this.loadConversations();
    });
  }

  loadMessages(conversationId: string): void {
    this.messagingService.getMessages(conversationId).subscribe(messages => {
      this.messages.set(messages);
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedConversation()) return;

    this.messagingService.sendMessage(this.selectedConversation()!.id, this.newMessage).subscribe(() => {
      this.newMessage = '';
      this.loadMessages(this.selectedConversation()!.id);
      this.loadConversations();
    });
  }

  deleteConversation(): void {
    if (!this.selectedConversation()) return;

    if (confirm('Are you sure you want to delete this conversation?')) {
      this.messagingService.deleteConversation(this.selectedConversation()!.id).subscribe(() => {
        this.selectedConversation.set(null);
        this.messages.set([]);
        this.loadConversations();
      });
    }
  }

  getEmployerName(conversation: Conversation): string {
    const employer = conversation.participants.find(p => p.role === 'employer');
    return employer?.name || 'Unknown';
  }

  getEmployerInitials(conversation: Conversation): string {
    const employer = conversation.participants.find(p => p.role === 'employer');
    if (employer?.avatar) return employer.avatar;

    const name = employer?.name || 'Unknown';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  formatMessageTime(timestamp: Date): string {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes === 0 ? 'Just now' : `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  handleEnterKey(event: any): void {
    if (!event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
