# Khisima Language Service Provider - Frontend

> Professional language services platform specializing in African languages, AI-ready language data, and comprehensive localization solutions.

## 🌍 About Khisima

Khisima is a leading language service provider focused on African languages and cultures. We offer comprehensive translation, localization, language data collection, and AI consulting services to help organizations reach African markets effectively.

### Key Services
- **Translation & Localization** - Professional translation services for 2000+ African languages
- **Language Data Services** - AI-ready datasets, annotation, and corpus development
- **Voice-over & Dubbing** - Cultural adaptation for African markets
- **AI Language Consulting** - NLP and machine learning support for low-resource languages
- **Multilingual SEO** - Market-specific optimization and content strategy

## 🚀 Features

### Public Portal
- **Home Page** - Service showcase and company overview
- **About Us** - Company story, mission, and team
- **Services Catalog** - Detailed service descriptions and capabilities
- **Quote Request System** - Multi-step quote request with file uploads
- **Career Applications** - Job opportunities with application tracking
- **Workplace Listings** - Countries and regions of operation
- **Resource Center** - Language resources and documentation

### AI Chat Agent
- **Real-time Support** - Intelligent customer service chatbot
- **Multi-language Detection** - Automatic language recognition
- **Context-aware Responses** - Service-specific assistance
- **Admin Console** - Live chat management and transcript export

### Admin Dashboard
- **Dashboard Overview** - Key metrics and analytics
- **Content Management** - Services, solutions, and partners
- **Quote Management** - Review and respond to client requests
- **Career Management** - Application tracking and candidate management
- **Notification System** - Customer inquiries and communications
- **AI Agent Console** - Live chat monitoring and management

## 🛠 Tech Stack

### Frontend Framework
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Tabler Icons** - Additional icon set
- **Framer Motion** - Animation library

### State Management
- **Redux Toolkit** - Predictable state container
- **RTK Query** - Data fetching and caching

### Forms & Validation
- **React Hook Form** - Performant forms library
- **Zod** - TypeScript-first schema validation

### Additional Features
- **Socket.IO Client** - Real-time communication
- **TipTap** - Rich text editor
- **Sonner** - Toast notifications
- **jsPDF** - PDF generation
- **React Dropzone** - File upload handling

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/irumva253/khisima---frontend.git
   cd khisima---frontend
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   # or
   pnpm install --legacy-peer-deps
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # Backend API URL
   VITE_APP_API_BASE_URL=http://localhost:5000
   
   # S3/Tigris Storage
   VITE_PUBLIC_S3_BUCKET_NAME_IMAGES=your-bucket-name
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

## 🏗 Project Structure

```
src/
├── (public)/                 # Public-facing components and screens
│   ├── components/           # Reusable UI components
│   │   ├── Footer.jsx       # Site footer with newsletter
│   │   ├── Navbar.jsx       # Navigation header
│   │   ├── KhismaAiAgent.jsx # AI chat widget
│   │   └── ...
│   └── screens/             # Page components
│       ├── HomeScreen.jsx   # Landing page
│       ├── AboutScreen.jsx  # About page
│       ├── QuoteScreen.jsx  # Quote request flow
│       ├── CareerScreen.jsx # Job applications
│       └── admin/           # Admin dashboard screens
├── app/                     # Next.js-style app directory
├── components/              # Shared UI components
│   ├── ui/                  # Base UI components (buttons, inputs, etc.)
│   └── sidebar/             # Admin sidebar components
├── hooks/                   # Custom React hooks
├── layouts/                 # Layout components
├── lib/                     # Utility libraries
├── slices/                  # Redux slices and API endpoints
├── utils/                   # Helper functions
├── constants.js             # API endpoints and configuration
├── store.js                 # Redux store configuration
└── main.jsx                 # Application entry point
```

## 🚦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔗 API Integration

The frontend integrates with a Node.js/Express backend API:

### Key API Endpoints
- `/api/auth/*` - Authentication and user management
- `/api/quotes/*` - Quote requests and management
- `/api/careers/*` - Job applications
- `/api/notifications/*` - Contact forms and inquiries
- `/api/agent/*` - AI chat agent functionality
- `/api/services/*` - Service catalog management
- `/api/partners/*` - Partner management

### Real-time Features
- **Socket.IO** integration for live chat
- **Admin presence** monitoring
- **Real-time notifications** for new inquiries

## 🎨 UI/UX Features

### Design System
- **Consistent theming** with CSS custom properties
- **Dark/light mode** support
- **Responsive design** for mobile and desktop
- **Accessibility-first** approach with Radix UI

### Animations
- **Smooth transitions** with Framer Motion
- **Loading states** and micro-interactions
- **Progressive disclosure** for complex forms

### Performance
- **Code splitting** with React.lazy
- **Image optimization** with modern formats
- **Bundle analysis** and optimization

## 🌐 Deployment

### Production Build
```bash
npm run build
```

### Vercel Deployment
The project includes `vercel.json` configuration for seamless Vercel deployment:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Environment Variables
Ensure the following environment variables are set in production:
- `VITE_APP_API_BASE_URL` - Backend API URL
- `VITE_PUBLIC_S3_BUCKET_NAME_IMAGES` - Image storage bucket

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards
- Follow **ESLint** configuration
- Use **conventional commits** for commit messages
- Ensure **responsive design** for all new components
- Add **proper error handling** and loading states

### Testing
- Test components in different screen sizes
- Verify form validation and error states
- Check API integration with backend
- Ensure accessibility compliance

## 📄 License

This project is proprietary software owned by Khisima Language Service Provider.

## 📞 Contact

- **Website**: [khisima.com](https://khisima.com)
- **Email**: info@khisima.com
- **Phone**: +250 789 619 370

## 🌟 Key Features Walkthrough

### AI Chat Agent
The KhismaAiAgent component provides intelligent customer support with:
- Local intent detection for common queries
- Real-time admin presence monitoring
- Conversation transcripts and email collection
- Seamless handoff to human agents

### Quote Request System
Multi-step quote request process including:
- Contact information collection
- Project details and requirements
- File upload capabilities
- Additional specifications
- Review and submission

### Admin Dashboard
Comprehensive management interface featuring:
- Real-time analytics and metrics
- Customer inquiry management
- Service and content administration
- AI chat console with live monitoring
- PDF export capabilities for reports

---

*Built with ❤️ for African languages and cultures*
