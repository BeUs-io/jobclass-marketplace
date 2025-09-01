import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, interval } from 'rxjs';
import { map, delay } from 'rxjs/operators';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'interview-invite' | 'offer' | 'system';
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface Conversation {
  id: string;
  participants: Participant[];
  lastMessage: Message;
  unreadCount: number;
  jobTitle?: string;
  company?: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: 'candidate' | 'employer';
  online: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private conversations = signal<Conversation[]>([
    {
      id: 'conv1',
      participants: [
        { id: 'user1', name: 'You', role: 'candidate', online: true },
        { id: 'emp1', name: 'TechCorp HR', role: 'employer', online: true, avatar: 'TC' }
      ],
      lastMessage: {
        id: 'msg3',
        conversationId: 'conv1',
        senderId: 'emp1',
        senderName: 'TechCorp HR',
        content: 'We would like to schedule an interview with you',
        timestamp: new Date('2024-03-20T10:30:00'),
        read: false,
        type: 'interview-invite'
      },
      unreadCount: 2,
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp'
    },
    {
      id: 'conv2',
      participants: [
        { id: 'user1', name: 'You', role: 'candidate', online: true },
        { id: 'emp2', name: 'StartupXYZ', role: 'employer', online: false, avatar: 'SX' }
      ],
      lastMessage: {
        id: 'msg6',
        conversationId: 'conv2',
        senderId: 'user1',
        senderName: 'You',
        content: 'Thank you for the opportunity!',
        timestamp: new Date('2024-03-19T15:45:00'),
        read: true,
        type: 'text'
      },
      unreadCount: 0,
      jobTitle: 'Full Stack Developer',
      company: 'StartupXYZ'
    }
  ]);

  private messages = signal<Message[]>([
    // Conversation 1 messages
    {
      id: 'msg1',
      conversationId: 'conv1',
      senderId: 'user1',
      senderName: 'You',
      content: 'Hi, I applied for the Senior Frontend Developer position.',
      timestamp: new Date('2024-03-20T09:00:00'),
      read: true,
      type: 'text' as const
    },
    {
      id: 'msg2',
      conversationId: 'conv1',
      senderId: 'emp1',
      senderName: 'TechCorp HR',
      content: 'Hello! Thank you for your application. We reviewed your profile and are impressed.',
      timestamp: new Date('2024-03-20T10:00:00'),
      read: true,
      type: 'text' as const
    },
    {
      id: 'msg3',
      conversationId: 'conv1',
      senderId: 'emp1',
      senderName: 'TechCorp HR',
      content: 'We would like to schedule an interview with you',
      timestamp: new Date('2024-03-20T10:30:00'),
      read: false,
      type: 'interview-invite' as const
    },
    // Conversation 2 messages
    {
      id: 'msg4',
      conversationId: 'conv2',
      senderId: 'emp2',
      senderName: 'StartupXYZ',
      content: 'Congratulations! We would like to offer you the position.',
      timestamp: new Date('2024-03-19T14:00:00'),
      read: true,
      type: 'offer' as const
    },
    {
      id: 'msg5',
      conversationId: 'conv2',
      senderId: 'user1',
      senderName: 'You',
      content: 'This is fantastic news! I am very interested.',
      timestamp: new Date('2024-03-19T15:30:00'),
      read: true,
      type: 'text' as const
    },
    {
      id: 'msg6',
      conversationId: 'conv2',
      senderId: 'user1',
      senderName: 'You',
      content: 'Thank you for the opportunity!',
      timestamp: new Date('2024-03-19T15:45:00'),
      read: true,
      type: 'text' as const
    }
  ]);

  unreadCount = computed(() => {
    return this.conversations().reduce((count, conv) => count + conv.unreadCount, 0);
  });

  constructor() {
    // Simulate real-time messages
    interval(30000).subscribe(() => {
      this.simulateNewMessage();
    });
  }

  private simulateNewMessage(): void {
    const randomMessages = [
      'Are you available for a quick call?',
      'We have reviewed your application',
      'Could you provide more details about your experience?',
      'Thank you for your interest in our company'
    ];

    const conversations = this.conversations();
    if (conversations.length > 0) {
      const conv = conversations[0];
      const newMessage: Message = {
        id: `msg${Date.now()}`,
        conversationId: conv.id,
        senderId: 'emp1',
        senderName: 'TechCorp HR',
        content: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        timestamp: new Date(),
        read: false,
        type: 'text'
      };

      this.messages.update(msgs => [...msgs, newMessage]);
      conv.lastMessage = newMessage;
      conv.unreadCount++;
      this.conversations.set([...conversations]);
    }
  }

  getConversations(): Observable<Conversation[]> {
    return of(this.conversations());
  }

  getMessages(conversationId: string): Observable<Message[]> {
    return of(this.messages().filter(m => m.conversationId === conversationId));
  }

  sendMessage(conversationId: string, content: string): Observable<Message> {
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      conversationId,
      senderId: 'user1',
      senderName: 'You',
      content,
      timestamp: new Date(),
      read: true,
      type: 'text'
    };

    this.messages.update(msgs => [...msgs, newMessage]);

    const conversations = this.conversations();
    const convIndex = conversations.findIndex(c => c.id === conversationId);
    if (convIndex !== -1) {
      conversations[convIndex].lastMessage = newMessage;
      this.conversations.set([...conversations]);
    }

    return of(newMessage).pipe(delay(300));
  }

  markAsRead(conversationId: string): Observable<boolean> {
    const messages = this.messages();
    const conversations = this.conversations();

    messages.forEach(msg => {
      if (msg.conversationId === conversationId && !msg.read && msg.senderId !== 'user1') {
        msg.read = true;
      }
    });

    const convIndex = conversations.findIndex(c => c.id === conversationId);
    if (convIndex !== -1) {
      conversations[convIndex].unreadCount = 0;
    }

    this.messages.set([...messages]);
    this.conversations.set([...conversations]);

    return of(true).pipe(delay(200));
  }

  deleteConversation(conversationId: string): Observable<boolean> {
    this.conversations.update(convs => convs.filter(c => c.id !== conversationId));
    this.messages.update(msgs => msgs.filter(m => m.conversationId !== conversationId));
    return of(true).pipe(delay(300));
  }
}
