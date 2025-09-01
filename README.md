# JobClass Marketplace

A comprehensive job board and freelance marketplace platform built with Angular 18, combining traditional job searching with freelance services.

## 🚀 Live Demo

- **GitHub Repository:** https://github.com/BeUs-io/jobclass-marketplace
- **Deploy to Netlify:** See deployment instructions below

## ✨ Features

### Job Board
- Advanced job search and filtering
- Company profiles and verification
- Resume builder
- Application tracking
- Premium job postings
- Employer dashboard
- Analytics dashboard

### Freelance Marketplace
- Browse and offer services (like Fiverr)
- Project bidding system (like Upwork)
- Dual dashboards for freelancers and clients
- Portfolio management
- Skill verification and testing
- Payment management with escrow
- Real-time messaging
- Dispute resolution

### User Modes
- **Job Seeker Mode** - Search and apply for traditional jobs
- **Employer Mode** - Post jobs and manage applications
- **Freelancer Mode** - Offer services and bid on projects
- **Client Mode** - Hire freelancers and post projects

## 🛠️ Technology Stack

- **Framework:** Angular 18
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Package Manager:** Bun
- **Deployment:** Netlify

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/BeUs-io/jobclass-marketplace.git

# Navigate to project directory
cd jobclass-marketplace/jobclass-angular

# Install dependencies
bun install

# Start development server
npm run start
```

The application will be available at `http://localhost:4200`

## 🚀 Deployment to Netlify

### Option 1: Deploy Pre-built Package (Fastest)

1. Download the deployment package: `jobclass-netlify-deploy.zip`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag and drop the zip file
4. Get your instant live URL

### Option 2: Deploy from GitHub

1. Go to [Netlify](https://app.netlify.com)
2. Click "Import an existing project"
3. Connect to GitHub and select `BeUs-io/jobclass-marketplace`
4. Configure build settings:
   - **Base directory:** `jobclass-angular`
   - **Build command:** `npm run build`
   - **Publish directory:** `jobclass-angular/dist/jobclass-angular/browser`
5. Click "Deploy"

### Option 3: Manual Build and Deploy

```bash
# Build the project
cd jobclass-angular
npm run build

# The build output will be in dist/jobclass-angular/browser
# Upload this folder to Netlify
```

## 📁 Project Structure

```
jobclass-angular/
├── src/
│   ├── app/
│   │   ├── components/     # Reusable components
│   │   ├── models/         # TypeScript interfaces
│   │   ├── pages/          # Page components
│   │   │   ├── marketplace/ # Freelance marketplace pages
│   │   │   └── ...        # Job board pages
│   │   └── services/       # Angular services
│   ├── assets/            # Static assets
│   └── styles.css         # Global styles
├── netlify.toml          # Netlify configuration
└── package.json          # Dependencies
```

## 🎨 Key Components

### Job Board
- Home page with job search
- Job listings and details
- Company profiles
- Application tracking
- Resume builder

### Marketplace
- Service browsing and creation
- Project posting and bidding
- Freelancer profiles
- Order management
- Payment processing

## 🔧 Configuration

The application includes mock data and services. To connect to real APIs:

1. Update service files in `src/app/services/`
2. Add environment variables for API endpoints
3. Configure authentication providers
4. Set up payment gateway (Stripe)

## 📝 Environment Setup

Create a `.env` file in the root directory:

```env
# API Configuration
API_URL=your_api_url
STRIPE_PUBLIC_KEY=your_stripe_key

# Authentication
AUTH0_DOMAIN=your_auth0_domain
AUTH0_CLIENT_ID=your_client_id
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with Angular 18
- Styled with Tailwind CSS
- Deployed on Netlify

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Built with ❤️ using Angular and Tailwind CSS**
