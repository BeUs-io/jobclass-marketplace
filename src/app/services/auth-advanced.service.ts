import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'candidate' | 'employer' | 'admin';
  avatar?: string;
  emailVerified: boolean;
  phoneVerified?: boolean;
  twoFactorEnabled: boolean;
  provider: 'email' | 'google' | 'linkedin' | 'github';
  providerId?: string;
  createdAt: Date;
  lastLogin: Date;
  profile?: UserProfile;
}

export interface UserProfile {
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  position?: string;
  skills?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  refreshToken?: string;
  requiresVerification?: boolean;
  requires2FA?: boolean;
}

export interface PasswordResetRequest {
  email: string;
  token?: string;
  newPassword?: string;
}

export interface EmailVerification {
  email: string;
  token: string;
  expiresAt: Date;
  verified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthAdvancedService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private verificationTokensSubject = new BehaviorSubject<Map<string, EmailVerification>>(new Map());
  private resetTokensSubject = new BehaviorSubject<Map<string, PasswordResetRequest>>(new Map());

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.loadCurrentUser();
    this.initializeSocialLoginListeners();
  }

  private loadCurrentUser() {
    const savedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('authToken');

    if (savedUser && token) {
      const user = JSON.parse(savedUser);
      user.createdAt = new Date(user.createdAt);
      user.lastLogin = new Date(user.lastLogin);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  // Email/Password Registration
  register(email: string, password: string, name: string, role: 'candidate' | 'employer'): Observable<AuthResponse> {
    // Simulate API call
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        if (existingUsers.find((u: any) => u.email === email)) {
          return {
            success: false,
            message: 'Email already registered'
          };
        }

        // Create new user
        const newUser: User = {
          id: 'user_' + Date.now(),
          email,
          name,
          role,
          emailVerified: false,
          twoFactorEnabled: false,
          provider: 'email',
          createdAt: new Date(),
          lastLogin: new Date(),
          avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
        };

        // Save user (in real app, this would be server-side)
        existingUsers.push({ ...newUser, password }); // Never store plain passwords!
        localStorage.setItem('users', JSON.stringify(existingUsers));

        // Generate verification token
        const verificationToken = this.generateToken();
        const verification: EmailVerification = {
          email,
          token: verificationToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          verified: false
        };

        const tokens = this.verificationTokensSubject.value;
        tokens.set(email, verification);
        this.verificationTokensSubject.next(tokens);

        // Send verification email (simulated)
        this.sendVerificationEmail(email, verificationToken);

        return {
          success: true,
          message: 'Registration successful. Please check your email to verify your account.',
          user: newUser,
          requiresVerification: true
        };
      })
    );
  }

  // Email/Password Login
  login(email: string, password: string): Observable<AuthResponse> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password);

        if (!user) {
          return {
            success: false,
            message: 'Invalid email or password'
          };
        }

        if (!user.emailVerified) {
          return {
            success: false,
            message: 'Please verify your email before logging in',
            requiresVerification: true
          };
        }

        // Generate tokens
        const token = this.generateToken();
        const refreshToken = this.generateToken();

        // Update last login
        user.lastLogin = new Date();

        // Save session
        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);

        return {
          success: true,
          message: 'Login successful',
          user,
          token,
          refreshToken,
          requires2FA: user.twoFactorEnabled
        };
      })
    );
  }

  // Social Login - Google
  loginWithGoogle(): Observable<AuthResponse> {
    return of(null).pipe(
      delay(1500),
      map(() => {
        // Simulate Google OAuth response
        const googleUser = {
          id: 'google_' + Date.now(),
          email: 'user@gmail.com',
          name: 'John Doe',
          avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
          provider: 'google' as const,
          providerId: 'google_123456'
        };

        const user: User = {
          ...googleUser,
          role: 'candidate',
          emailVerified: true, // Google emails are pre-verified
          twoFactorEnabled: false,
          createdAt: new Date(),
          lastLogin: new Date()
        };

        // Save session
        const token = this.generateToken();
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);

        return {
          success: true,
          message: 'Successfully logged in with Google',
          user,
          token
        };
      })
    );
  }

  // Social Login - LinkedIn
  loginWithLinkedIn(): Observable<AuthResponse> {
    return of(null).pipe(
      delay(1500),
      map(() => {
        const linkedinUser = {
          id: 'linkedin_' + Date.now(),
          email: 'professional@linkedin.com',
          name: 'Jane Smith',
          avatar: 'https://media.licdn.com/dms/image/default-profile',
          provider: 'linkedin' as const,
          providerId: 'linkedin_789012',
          profile: {
            bio: 'Senior Software Engineer with 10+ years experience',
            company: 'TechCorp',
            position: 'Senior Developer',
            location: 'San Francisco, CA'
          }
        };

        const user: User = {
          ...linkedinUser,
          role: 'candidate',
          emailVerified: true,
          twoFactorEnabled: false,
          createdAt: new Date(),
          lastLogin: new Date()
        };

        const token = this.generateToken();
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);

        return {
          success: true,
          message: 'Successfully logged in with LinkedIn',
          user,
          token
        };
      })
    );
  }

  // Social Login - GitHub
  loginWithGitHub(): Observable<AuthResponse> {
    return of(null).pipe(
      delay(1500),
      map(() => {
        const githubUser = {
          id: 'github_' + Date.now(),
          email: 'developer@github.com',
          name: 'Dev User',
          avatar: 'https://avatars.githubusercontent.com/u/1234567',
          provider: 'github' as const,
          providerId: 'github_345678',
          profile: {
            bio: 'Full-stack developer | Open source contributor',
            website: 'https://github.com/devuser',
            location: 'Remote',
            socialLinks: {
              github: 'https://github.com/devuser'
            }
          }
        };

        const user: User = {
          ...githubUser,
          role: 'candidate',
          emailVerified: true,
          twoFactorEnabled: false,
          createdAt: new Date(),
          lastLogin: new Date()
        };

        const token = this.generateToken();
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);

        return {
          success: true,
          message: 'Successfully logged in with GitHub',
          user,
          token
        };
      })
    );
  }

  // Email Verification
  verifyEmail(token: string): Observable<AuthResponse> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const tokens = this.verificationTokensSubject.value;

        // Find token
        let verification: EmailVerification | undefined;
        let email: string | undefined;

        tokens.forEach((value, key) => {
          if (value.token === token) {
            verification = value;
            email = key;
          }
        });

        if (!verification || !email) {
          return {
            success: false,
            message: 'Invalid or expired verification token'
          };
        }

        if (new Date() > verification.expiresAt) {
          return {
            success: false,
            message: 'Verification token has expired'
          };
        }

        // Mark email as verified
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.email === email);

        if (user) {
          user.emailVerified = true;
          localStorage.setItem('users', JSON.stringify(users));

          // Remove used token
          tokens.delete(email);
          this.verificationTokensSubject.next(tokens);

          return {
            success: true,
            message: 'Email verified successfully. You can now log in.',
            user
          };
        }

        return {
          success: false,
          message: 'User not found'
        };
      })
    );
  }

  // Resend Verification Email
  resendVerificationEmail(email: string): Observable<AuthResponse> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.email === email);

        if (!user) {
          return {
            success: false,
            message: 'Email not found'
          };
        }

        if (user.emailVerified) {
          return {
            success: false,
            message: 'Email is already verified'
          };
        }

        // Generate new token
        const verificationToken = this.generateToken();
        const verification: EmailVerification = {
          email,
          token: verificationToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          verified: false
        };

        const tokens = this.verificationTokensSubject.value;
        tokens.set(email, verification);
        this.verificationTokensSubject.next(tokens);

        this.sendVerificationEmail(email, verificationToken);

        return {
          success: true,
          message: 'Verification email sent successfully'
        };
      })
    );
  }

  // Password Reset Request
  requestPasswordReset(email: string): Observable<AuthResponse> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.email === email);

        if (!user) {
          // Don't reveal if email exists
          return {
            success: true,
            message: 'If an account exists with this email, a password reset link has been sent.'
          };
        }

        // Generate reset token
        const resetToken = this.generateToken();
        const resetRequest: PasswordResetRequest = {
          email,
          token: resetToken
        };

        const tokens = this.resetTokensSubject.value;
        tokens.set(resetToken, resetRequest);
        this.resetTokensSubject.next(tokens);

        this.sendPasswordResetEmail(email, resetToken);

        return {
          success: true,
          message: 'Password reset email sent successfully'
        };
      })
    );
  }

  // Reset Password
  resetPassword(token: string, newPassword: string): Observable<AuthResponse> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const tokens = this.resetTokensSubject.value;
        const resetRequest = tokens.get(token);

        if (!resetRequest) {
          return {
            success: false,
            message: 'Invalid or expired reset token'
          };
        }

        // Update password
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.email === resetRequest.email);

        if (user) {
          user.password = newPassword; // In real app, hash the password!
          localStorage.setItem('users', JSON.stringify(users));

          // Remove used token
          tokens.delete(token);
          this.resetTokensSubject.next(tokens);

          return {
            success: true,
            message: 'Password reset successfully. You can now log in with your new password.'
          };
        }

        return {
          success: false,
          message: 'User not found'
        };
      })
    );
  }

  // Change Password (for logged-in users)
  changePassword(currentPassword: string, newPassword: string): Observable<AuthResponse> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const currentUser = this.currentUserSubject.value;

        if (!currentUser) {
          return {
            success: false,
            message: 'Not authenticated'
          };
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.email === currentUser.email);

        if (!user || user.password !== currentPassword) {
          return {
            success: false,
            message: 'Current password is incorrect'
          };
        }

        user.password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));

        return {
          success: true,
          message: 'Password changed successfully'
        };
      })
    );
  }

  // Enable 2FA
  enable2FA(): Observable<AuthResponse> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const user = this.currentUserSubject.value;

        if (!user) {
          return {
            success: false,
            message: 'Not authenticated'
          };
        }

        user.twoFactorEnabled = true;
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));

        return {
          success: true,
          message: 'Two-factor authentication enabled successfully'
        };
      })
    );
  }

  // Verify 2FA Code
  verify2FA(code: string): Observable<AuthResponse> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Simulate 2FA verification
        const validCode = '123456';

        if (code === validCode) {
          return {
            success: true,
            message: '2FA verification successful'
          };
        }

        return {
          success: false,
          message: 'Invalid 2FA code'
        };
      })
    );
  }

  // Logout
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  // Refresh Token
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      return of({
        success: false,
        message: 'No refresh token found'
      });
    }

    return of(null).pipe(
      delay(500),
      map(() => {
        const newToken = this.generateToken();
        localStorage.setItem('authToken', newToken);

        return {
          success: true,
          message: 'Token refreshed',
          token: newToken
        };
      })
    );
  }

  // Helper Methods
  private generateToken(): string {
    return Math.random().toString(36).substr(2) + Date.now().toString(36);
  }

  private sendVerificationEmail(email: string, token: string): void {
    const verificationUrl = `${window.location.origin}/verify-email?token=${token}`;
    console.log(`📧 Verification email sent to ${email}`);
    console.log(`Verification URL: ${verificationUrl}`);
  }

  private sendPasswordResetEmail(email: string, token: string): void {
    const resetUrl = `${window.location.origin}/reset-password?token=${token}`;
    console.log(`📧 Password reset email sent to ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
  }

  private initializeSocialLoginListeners(): void {
    // In a real app, you would initialize OAuth SDKs here
    // Google Sign-In, LinkedIn SDK, GitHub OAuth, etc.
    console.log('Social login providers initialized');
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Update user profile
  updateProfile(profile: Partial<UserProfile>): Observable<AuthResponse> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const user = this.currentUserSubject.value;

        if (!user) {
          return {
            success: false,
            message: 'Not authenticated'
          };
        }

        user.profile = { ...user.profile, ...profile };
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));

        return {
          success: true,
          message: 'Profile updated successfully',
          user
        };
      })
    );
  }
}
