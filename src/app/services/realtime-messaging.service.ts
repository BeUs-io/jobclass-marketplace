import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject, interval, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image' | 'system';
  status: 'sent' | 'delivered' | 'read';
  attachments?: MessageAttachment[];
  replyTo?: string;
  edited?: boolean;
  editedAt?: Date;
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Conversation {
  id: string;
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  projectId?: string;
  orderId?: string;
  type: 'direct' | 'order' | 'project' | 'support';
  status: 'active' | 'archived' | 'closed';
}

export interface Participant {
  userId: string;
  name: string;
  avatar?: string;
  role: 'freelancer' | 'client' | 'support';
  isOnline: boolean;
  lastSeen?: Date;
  typing?: boolean;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RealtimeMessagingService {
  private conversations$ = new BehaviorSubject<Conversation[]>([]);
  private activeConversation$ = new BehaviorSubject<Conversation | null>(null);
  private messages$ = new BehaviorSubject<Message[]>([]);
  private typingIndicators$ = new Subject<TypingIndicator>();
  private onlineUsers$ = new BehaviorSubject<Set<string>>(new Set());
  private unreadMessages$ = new BehaviorSubject<number>(0);

  // Mock data
  private mockConversations: Conversation[] = [
    {
      id: 'conv_1',
      participants: [
        {
          userId: 'user_1',
          name: 'John Client',
          role: 'client',
          isOnline: true,
          lastSeen: new Date()
        },
        {
          userId: 'user_2',
          name: 'Sarah Designer',
          role: 'freelancer',
          isOnline: true,
          lastSeen: new Date()
        }
      ],
      lastMessage: {
        id: 'msg_1',
        conversationId: 'conv_1',
        senderId: 'user_1',
        senderName: 'John Client',
        receiverId: 'user_2',
        content: 'Hi Sarah, I need some changes to the logo design.',
        timestamp: new Date('2024-08-30T10:30:00'),
        type: 'text',
        status: 'read'
      },
      unreadCount: 0,
      createdAt: new Date('2024-08-25'),
      updatedAt: new Date('2024-08-30'),
      orderId: 'order_123',
      type: 'order',
      status: 'active'
    },
    {
      id: 'conv_2',
      participants: [
        {
          userId: 'user_1',
          name: 'Mike Developer',
          role: 'freelancer',
          isOnline: false,
          lastSeen: new Date('2024-08-29')
        },
        {
          userId: 'user_3',
          name: 'Emma Client',
          role: 'client',
          isOnline: true,
          lastSeen: new Date()
        }
      ],
      lastMessage: {
        id: 'msg_2',
        conversationId: 'conv_2',
        senderId: 'user_3',
        senderName: 'Emma Client',
        receiverId: 'user_1',
        content: 'Thanks for the quick update!',
        timestamp: new Date('2024-08-29T15:45:00'),
        type: 'text',
        status: 'delivered'
      },
      unreadCount: 2,
      createdAt: new Date('2024-08-20'),
      updatedAt: new Date('2024-08-29'),
      projectId: 'project_456',
      type: 'project',
      status: 'active'
    }
  ];

  private mockMessages: { [conversationId: string]: Message[] } = {
    'conv_1': [
      {
        id: 'msg_1',
        conversationId: 'conv_1',
        senderId: 'user_1',
        senderName: 'John Client',
        receiverId: 'user_2',
        content: 'Hi Sarah, I need some changes to the logo design.',
        timestamp: new Date('2024-08-30T10:30:00'),
        type: 'text',
        status: 'read'
      },
      {
        id: 'msg_2',
        conversationId: 'conv_1',
        senderId: 'user_2',
        senderName: 'Sarah Designer',
        receiverId: 'user_1',
        content: 'Sure! What changes would you like?',
        timestamp: new Date('2024-08-30T10:32:00'),
        type: 'text',
        status: 'read'
      },
      {
        id: 'msg_3',
        conversationId: 'conv_1',
        senderId: 'user_1',
        senderName: 'John Client',
        receiverId: 'user_2',
        content: 'Can we make the colors more vibrant? And maybe adjust the font?',
        timestamp: new Date('2024-08-30T10:35:00'),
        type: 'text',
        status: 'read'
      }
    ]
  };

  constructor() {
    this.conversations$.next(this.mockConversations);
    this.calculateUnreadMessages();

    // Simulate real-time updates
    this.simulateRealtimeUpdates();
  }

  // Get all conversations
  getConversations(userId: string): Observable<Conversation[]> {
    return this.conversations$.asObservable();
  }

  // Get conversation by ID
  getConversation(conversationId: string): Observable<Conversation | undefined> {
    return this.conversations$.pipe(
      map(conversations => conversations.find(c => c.id === conversationId))
    );
  }

  // Get messages for a conversation
  getMessages(conversationId: string): Observable<Message[]> {
    const messages = this.mockMessages[conversationId] || [];
    this.messages$.next(messages);
    return this.messages$.asObservable();
  }

  // Send a message
  sendMessage(conversationId: string, content: string, senderId: string, receiverId: string, attachments?: MessageAttachment[]): Observable<Message> {
    const message: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId,
      senderName: 'Current User',
      receiverId,
      content,
      timestamp: new Date(),
      type: attachments && attachments.length > 0 ? 'file' : 'text',
      status: 'sent',
      attachments
    };

    // Add to messages
    if (!this.mockMessages[conversationId]) {
      this.mockMessages[conversationId] = [];
    }
    this.mockMessages[conversationId].push(message);

    // Update messages subject
    this.messages$.next(this.mockMessages[conversationId]);

    // Update conversation's last message
    const conversations = this.conversations$.value;
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.lastMessage = message;
      conversation.updatedAt = new Date();
      this.conversations$.next(conversations);
    }

    // Simulate message delivery
    setTimeout(() => {
      message.status = 'delivered';
      this.messages$.next(this.mockMessages[conversationId]);
    }, 1000);

    // Simulate message read
    setTimeout(() => {
      message.status = 'read';
      this.messages$.next(this.mockMessages[conversationId]);
    }, 3000);

    return of(message).pipe(delay(500));
  }

  // Create a new conversation
  createConversation(participants: Participant[], type: 'direct' | 'order' | 'project', relatedId?: string): Observable<Conversation> {
    const conversation: Conversation = {
      id: `conv_${Date.now()}`,
      participants,
      unreadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      type,
      status: 'active',
      orderId: type === 'order' ? relatedId : undefined,
      projectId: type === 'project' ? relatedId : undefined
    };

    const conversations = this.conversations$.value;
    conversations.unshift(conversation);
    this.conversations$.next(conversations);

    return of(conversation).pipe(delay(500));
  }

  // Mark messages as read
  markAsRead(conversationId: string, userId: string): Observable<boolean> {
    const messages = this.mockMessages[conversationId];
    if (messages) {
      messages.forEach(msg => {
        if (msg.receiverId === userId && msg.status !== 'read') {
          msg.status = 'read';
        }
      });
      this.messages$.next(messages);
    }

    // Update unread count
    const conversations = this.conversations$.value;
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
      this.conversations$.next(conversations);
      this.calculateUnreadMessages();
    }

    return of(true).pipe(delay(200));
  }

  // Delete a message
  deleteMessage(messageId: string, conversationId: string): Observable<boolean> {
    const messages = this.mockMessages[conversationId];
    if (messages) {
      const index = messages.findIndex(m => m.id === messageId);
      if (index > -1) {
        messages.splice(index, 1);
        this.messages$.next(messages);
      }
    }
    return of(true).pipe(delay(300));
  }

  // Edit a message
  editMessage(messageId: string, conversationId: string, newContent: string): Observable<Message | null> {
    const messages = this.mockMessages[conversationId];
    if (messages) {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        message.content = newContent;
        message.edited = true;
        message.editedAt = new Date();
        this.messages$.next(messages);
        return of(message).pipe(delay(300));
      }
    }
    return of(null);
  }

  // Send typing indicator
  sendTypingIndicator(conversationId: string, userId: string, isTyping: boolean): void {
    this.typingIndicators$.next({ conversationId, userId, isTyping });
  }

  // Get typing indicators
  getTypingIndicators(): Observable<TypingIndicator> {
    return this.typingIndicators$.asObservable();
  }

  // Update user online status
  updateOnlineStatus(userId: string, isOnline: boolean): void {
    const onlineUsers = this.onlineUsers$.value;
    if (isOnline) {
      onlineUsers.add(userId);
    } else {
      onlineUsers.delete(userId);
    }
    this.onlineUsers$.next(onlineUsers);

    // Update participant status in conversations
    const conversations = this.conversations$.value;
    conversations.forEach(conv => {
      const participant = conv.participants.find(p => p.userId === userId);
      if (participant) {
        participant.isOnline = isOnline;
        participant.lastSeen = new Date();
      }
    });
    this.conversations$.next(conversations);
  }

  // Get online users
  getOnlineUsers(): Observable<Set<string>> {
    return this.onlineUsers$.asObservable();
  }

  // Archive conversation
  archiveConversation(conversationId: string): Observable<boolean> {
    const conversations = this.conversations$.value;
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.status = 'archived';
      this.conversations$.next(conversations);
    }
    return of(true).pipe(delay(300));
  }

  // Get unread message count
  getUnreadCount(): Observable<number> {
    return this.unreadMessages$.asObservable();
  }

  // Upload attachment
  uploadAttachment(file: File): Observable<MessageAttachment> {
    // Simulate file upload
    const attachment: MessageAttachment = {
      id: `att_${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      size: file.size
    };
    return of(attachment).pipe(delay(1500));
  }

  // Search messages
  searchMessages(query: string, conversationId?: string): Observable<Message[]> {
    let allMessages: Message[] = [];

    if (conversationId) {
      allMessages = this.mockMessages[conversationId] || [];
    } else {
      Object.values(this.mockMessages).forEach(messages => {
        allMessages = allMessages.concat(messages);
      });
    }

    const filtered = allMessages.filter(msg =>
      msg.content.toLowerCase().includes(query.toLowerCase())
    );

    return of(filtered).pipe(delay(300));
  }

  // Private helper methods
  private calculateUnreadMessages(): void {
    const conversations = this.conversations$.value;
    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    this.unreadMessages$.next(totalUnread);
  }

  private simulateRealtimeUpdates(): void {
    // Simulate incoming messages every 30 seconds
    interval(30000).subscribe(() => {
      const conversations = this.conversations$.value;
      if (conversations.length > 0) {
        const randomConv = conversations[Math.floor(Math.random() * conversations.length)];
        const simulatedMessage: Message = {
          id: `msg_${Date.now()}`,
          conversationId: randomConv.id,
          senderId: 'other_user',
          senderName: 'Other User',
          receiverId: 'current_user',
          content: 'This is a simulated real-time message!',
          timestamp: new Date(),
          type: 'text',
          status: 'delivered'
        };

        if (!this.mockMessages[randomConv.id]) {
          this.mockMessages[randomConv.id] = [];
        }
        this.mockMessages[randomConv.id].push(simulatedMessage);

        randomConv.lastMessage = simulatedMessage;
        randomConv.unreadCount++;
        randomConv.updatedAt = new Date();

        this.conversations$.next(conversations);
        this.calculateUnreadMessages();

        if (this.activeConversation$.value?.id === randomConv.id) {
          this.messages$.next(this.mockMessages[randomConv.id]);
        }
      }
    });
  }
}
