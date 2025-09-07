# Job Tracker

> A CRM system designed specifically for tracking job applications, managing contacts, and organizing your job search workflow.

![Rails](https://img.shields.io/badge/Rails-8.1.0_beta-red?logo=rubyonrails)
![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2.1.5-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.13-teal?logo=tailwindcss)

## 📋 About

Job Tracker is a comprehensive CRM application that helps job seekers organize and manage their job search process. Unlike generic task managers or spreadsheets, Job Tracker is purpose-built for the unique workflows of job searching.

### ✨ Key Features

- **Company & Contact Management** - Track companies, roles, and key contacts
- **Application Pipeline** - Manage applications from draft to offer/rejection
- **Interview Scheduling** - Organize multiple interview rounds with notes and feedback
- **Communication Log** - Track all messages and follow-ups with recruiters and hiring managers
- **Content Planning** - Manage blog posts and project ideas related to your applications
- **Task Management** - Personal todos and deadlines
- **Dashboard Overview** - Get insights into your job search progress

## 🛠 Tech Stack

This project leverages a full-stack monolith architecture:

### Backend
- **Ruby on Rails 8.1.0 (beta)** - Web framework with latest features
- **SQLite** - Database (easily configurable for PostgreSQL in production)
- **Rails Authentication** - Built-in authentication system
- **Inertia.js Rails Adapter** - Server-side rendering with client-side navigation

### Frontend
- **React 19.1.1** - Modern React with latest features
- **Inertia.js** - SPA-like experience without API complexity
- **TypeScript 5.9.2** - Type safety and better developer experience
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible component library
- **Lucide React** - Modern icon system

### Development Tools
- **Vite** - Fast build tool and development server
- **Rails Test Suite** - Comprehensive model and integration testing

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- Ruby 3.4.5 or higher
- Node.js 18+ and npm
- SQLite3

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/matiasmoya/job-tracker.git
   cd job-tracker
   ```

2. **Install Ruby dependencies**
   ```bash
   bundle install
   ```

3. **Install JavaScript dependencies**
   ```bash
   npm install
   ```

4. **Set up the database**
   ```bash
   rails db:create
   rails db:migrate
   ```

5. **Start the development servers**
   
   In one terminal:
   ```bash
   bin/dev
   ```
   
   The application will be available at `http://localhost:3100`

### First Time Setup

1. **Create your first user account**
   
   Use rails console to create your user. Account signup is out of the scope of the MVP.
   I plan to use [ActiveRecordTenanted](https://github.com/basecamp/activerecord-tenanted)

2. **Explore the features**
   
   - Add your first company in the dashboard
   - Create a job opening and application
   - Set up interviews and track communications

## 🏗 Project Structure

```
job-tracker/
├── app/
│   ├── controllers/          # Rails controllers
│   ├── models/              # Active Record models
│   ├── views/               # Rails views (minimal, mostly for layouts)
│   └── frontend/            # React frontend code
│       ├── components/      # React components
│       ├── pages/          # Inertia.js page components
│       ├── entrypoints/    # CSS and JS entry points
│       └── lib/            # Utility functions
├── db/
│   ├── migrate/            # Database migrations
│   └── seeds.rb           # Database seeds
├── test/                  # Test files
│   ├── models/           # Model tests
│   └── fixtures/         # Test data
└── config/               # Rails configuration
```

## 🧪 Testing

Run the full test suite:

```bash
rails test
```

Run specific model tests:

```bash
rails test test/models/
```

Check TypeScript types:

```bash
npm run check
```

## 🎯 Core Models

The application is built around these core models:

- **Company** - Organizations you're applying to
- **Contact** - People at companies (recruiters, hiring managers, etc.)
- **JobOpening** - Specific roles at companies
- **ApplicationProcess** - Your application journey for each role
- **Interview** - Individual interview rounds
- **Message** - Communications with contacts
- **ContentIdea** - Blog posts and projects related to your search
- **Task** - Personal todos and deadlines

## 🤝 Contributing

We welcome contributions to Job Tracker! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation if needed
4. **Run tests**
   ```bash
   rails test
   npm run check
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add: Your feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**

### Ways to Contribute

- 🐛 **Bug Fixes** - Help us squash bugs
- ✨ **New Features** - Add functionality that benefits job seekers
- 📖 **Documentation** - Improve setup guides, API docs, or code comments
- 🎨 **UI/UX Improvements** - Enhance the user interface and experience
- 🧪 **Testing** - Add test coverage or improve existing tests
- 🚀 **Performance** - Optimize queries, reduce bundle size, improve loading times
- 🔒 **Security** - Identify and fix security vulnerabilities

### Development Guidelines

- Follow Rails and React best practices
- Write meaningful commit messages
- Include tests for new features
- Keep the codebase accessible and well-documented
- Maintain the existing code style

### Feature Roadmap

Some areas where we'd love contributions:

- **Email Integration** - Connect with Gmail/Outlook for message tracking
- **Calendar Sync** - Integration with Google Calendar/Outlook
- **Analytics Dashboard** - Job search metrics and insights
- **Export/Import** - CSV/Excel data management
- **Browser Extension** - Quick save job postings from job boards
- **Mobile App** - React Native companion app
- **API Endpoints** - REST API for third-party integrations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/license/MIT) file for details.

---

**Made with ❤️ for job seekers everywhere**

*Happy job hunting! 🎯*
