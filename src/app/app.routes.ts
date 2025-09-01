import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'jobs', loadComponent: () => import('./pages/jobs/jobs.component').then(m => m.JobsComponent) },
  { path: 'job/:id', loadComponent: () => import('./pages/job-detail/job-detail.component').then(m => m.JobDetailComponent) },
  { path: 'companies', loadComponent: () => import('./pages/companies/companies.component').then(m => m.CompaniesComponent) },
  { path: 'company/:id', loadComponent: () => import('./pages/company-profile/company-profile.component').then(m => m.CompanyProfileComponent) },
  { path: 'categories', loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent) },
  { path: 'post-job', loadComponent: () => import('./pages/post-job/post-job.component').then(m => m.PostJobComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'employer-dashboard', loadComponent: () => import('./pages/employer-dashboard/employer-dashboard.component').then(m => m.EmployerDashboardComponent) },
  { path: 'resume-builder', loadComponent: () => import('./pages/resume-builder/resume-builder.component').then(m => m.ResumeBuilderComponent) },
  { path: 'pricing', loadComponent: () => import('./pages/pricing/pricing.component').then(m => m.PricingComponent) },
  { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'analytics', loadComponent: () => import('./pages/analytics-dashboard/analytics-dashboard.component').then(m => m.AnalyticsDashboardComponent) },
  { path: 'admin', loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'reset-password', loadComponent: () => import('./pages/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'application-tracker', loadComponent: () => import('./pages/application-tracker/application-tracker.component').then(m => m.ApplicationTrackerComponent) },
  { path: 'messages', loadComponent: () => import('./pages/messages/messages.component').then(m => m.MessagesComponent) },
  { path: 'company-verification', loadComponent: () => import('./pages/company-verification/company-verification.component').then(m => m.CompanyVerificationComponent) },
  { path: 'company-comparison', loadComponent: () => import('./pages/company-comparison/company-comparison.component').then(m => m.CompanyComparisonComponent) },

  // Freelance Marketplace Routes
  { path: 'marketplace', loadComponent: () => import('./pages/marketplace/marketplace-home/marketplace-home.component').then(m => m.MarketplaceHomeComponent) },
  { path: 'services', loadComponent: () => import('./pages/marketplace/browse-services/browse-services.component').then(m => m.BrowseServicesComponent) },
  { path: 'service/:id', loadComponent: () => import('./pages/marketplace/service-detail/service-detail.component').then(m => m.ServiceDetailComponent) },
  { path: 'projects', loadComponent: () => import('./pages/marketplace/browse-projects/browse-projects.component').then(m => m.BrowseProjectsComponent) },
  { path: 'project/:id', loadComponent: () => import('./pages/marketplace/project-detail/project-detail.component').then(m => m.ProjectDetailComponent) },
  { path: 'freelancer-dashboard', loadComponent: () => import('./pages/marketplace/freelancer-dashboard/freelancer-dashboard.component').then(m => m.FreelancerDashboardComponent) },
  { path: 'client-dashboard', loadComponent: () => import('./pages/marketplace/client-dashboard/client-dashboard.component').then(m => m.ClientDashboardComponent) },
  { path: 'create-service', loadComponent: () => import('./pages/marketplace/create-service/create-service.component').then(m => m.CreateServiceComponent) },
  { path: 'post-project', loadComponent: () => import('./pages/marketplace/post-project/post-project.component').then(m => m.PostProjectComponent) },
  { path: 'submit-proposal/:projectId', loadComponent: () => import('./pages/marketplace/submit-proposal/submit-proposal.component').then(m => m.SubmitProposalComponent) },
  { path: 'freelancer-profile/:id', loadComponent: () => import('./pages/marketplace/freelancer-profile/freelancer-profile.component').then(m => m.FreelancerProfileComponent) },
  { path: 'manage-orders', loadComponent: () => import('./pages/marketplace/manage-orders/manage-orders.component').then(m => m.ManageOrdersComponent) },
  { path: 'order/:id', loadComponent: () => import('./pages/marketplace/order-detail/order-detail.component').then(m => m.OrderDetailComponent) },
  { path: 'portfolio', loadComponent: () => import('./pages/marketplace/portfolio/portfolio.component').then(m => m.PortfolioComponent) },
  { path: 'payment-management', loadComponent: () => import('./pages/marketplace/payment-management/payment-management.component').then(m => m.PaymentManagementComponent) },

  { path: '**', redirectTo: '' }
];
