# Project Architecture

This document outlines the technical architecture and design decisions for the Khisima Language Service Provider frontend application.

## 🏗 System Overview

The Khisima frontend is a modern React single-page application (SPA) that provides a comprehensive platform for language services, client management, and AI-powered customer support.

### Architecture Principles
- **Component-Based Architecture**: Reusable, modular components
- **State Management**: Centralized state with Redux Toolkit
- **API-First Design**: Clean separation between frontend and backend
- **Mobile-First Responsive**: Progressive enhancement approach
- **Accessibility-First**: WCAG 2.1 AA compliance throughout

## 📱 Application Structure

### Layer Architecture
```
┌─────────────────────────────────────┐
│             Presentation            │  ← React Components, UI/UX
├─────────────────────────────────────┤
│              Business               │  ← Redux Slices, Custom Hooks
├─────────────────────────────────────┤
│               Data                  │  ← RTK Query, API Integration
├─────────────────────────────────────┤
│            Infrastructure           │  ← Routing, Utilities, Config
└─────────────────────────────────────┘
```

### Directory Structure
```
src/
├── (public)/                 # Public-facing application
│   ├── components/           # Shared UI components
│   └── screens/              # Page-level components
├── app/                      # Next.js-style app directory
├── components/               # Reusable UI primitives
│   ├── ui/                   # Base components (Button, Input, etc.)
│   └── sidebar/              # Admin interface components
├── hooks/                    # Custom React hooks
├── layouts/                  # Layout wrapper components
├── lib/                      # Third-party library configurations
├── slices/                   # Redux slices and RTK Query APIs
├── utils/                    # Pure utility functions
├── constants.js              # Application constants
├── store.js                  # Redux store configuration
└── main.jsx                  # Application entry point
```

## ⚛️ React Architecture

### Component Hierarchy
```
App
├── ThemeProvider
├── Toaster (Global notifications)
├── Navbar (Conditional)
├── Router Outlet
│   ├── Public Routes
│   │   ├── HomeScreen
│   │   ├── AboutScreen
│   │   ├── QuoteScreen
│   │   ├── CareerScreen
│   │   └── ...
│   └── Protected Routes
│       └── AdminDashboard
│           ├── AdminSidebar
│           ├── AdminHeader
│           └── Admin Screens
└── Footer (Conditional)
```

### Component Patterns

#### Compound Components
```jsx
// Multi-step forms using compound pattern
<QuoteForm>
  <QuoteForm.ContactStep />
  <QuoteForm.ProjectStep />
  <QuoteForm.FilesStep />
  <QuoteForm.ReviewStep />
</QuoteForm>
```

#### Render Props
```jsx
// Data fetching with render props
<DataProvider query={useGetQuotesQuery}>
  {({ data, loading, error }) => (
    <QuotesList quotes={data} loading={loading} error={error} />
  )}
</DataProvider>
```

#### Custom Hooks
```jsx
// Reusable stateful logic
const useFormProgress = (steps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  
  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  
  return { currentStep, completedSteps, nextStep, prevStep };
};
```

## 🗂 State Management

### Redux Store Structure
```javascript
{
  auth: {
    user: null,
    token: null,
    isAuthenticated: false
  },
  ui: {
    theme: 'system',
    sidebarOpen: false,
    notifications: []
  },
  api: {
    // RTK Query state
    queries: {},
    mutations: {},
    provided: {},
    subscriptions: {}
  }
}
```

### RTK Query Integration
```javascript
// API slice pattern
export const quotesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuotes: builder.query({
      query: (params) => ({
        url: '/api/quotes',
        params,
      }),
      providesTags: ['Quote'],
    }),
    createQuote: builder.mutation({
      query: (data) => ({
        url: '/api/quotes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Quote'],
    }),
  }),
});
```

## 🎨 UI Architecture

### Design System
```
Design Tokens
├── Colors
│   ├── Primary: Blue (#3a7acc)
│   ├── Secondary: Gray
│   ├── Success: Green
│   ├── Warning: Yellow
│   └── Error: Red
├── Typography
│   ├── Font Family: Inter
│   ├── Font Sizes: 12px - 48px
│   └── Font Weights: 400, 500, 600, 700
├── Spacing
│   └── Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
└── Breakpoints
    ├── Mobile: 640px
    ├── Tablet: 768px
    ├── Desktop: 1024px
    └── Large: 1280px
```

### Component Library Structure
```
UI Components
├── Primitives (Radix UI)
│   ├── Button
│   ├── Input
│   ├── Select
│   ├── Dialog
│   └── ...
├── Composed Components
│   ├── FormField
│   ├── DataTable
│   ├── Card
│   └── ...
└── Layout Components
    ├── Container
    ├── Grid
    ├── Stack
    └── ...
```

### Theming System
```css
/* CSS Custom Properties */
:root {
  --color-primary: 58 122 204;
  --color-background: 255 255 255;
  --color-foreground: 15 23 42;
  --radius: 0.5rem;
  --font-sans: 'Inter', sans-serif;
}

[data-theme="dark"] {
  --color-background: 15 23 42;
  --color-foreground: 248 250 252;
}
```

## 🔌 API Integration

### Request/Response Flow
```
Component → Hook → RTK Query → API Slice → Backend
    ↑                                           ↓
    └─────── State Update ←── Response ←────────┘
```

### Error Handling Strategy
```javascript
// Centralized error handling
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error?.status === 401) {
    // Handle authentication errors
    api.dispatch(logout());
    window.location.href = '/login';
  }
  
  if (result.error?.status >= 500) {
    // Handle server errors
    toast.error('Server error. Please try again later.');
  }
  
  return result;
};
```

## 🚀 Performance Architecture

### Code Splitting Strategy
```javascript
// Route-based splitting
const AdminDashboard = lazy(() => import('./layouts/AdminDashboard'));
const QuoteScreen = lazy(() => import('./screens/QuoteScreen'));

// Component-based splitting
const TiptapEditor = lazy(() => import('./components/TiptapEditor'));
```

### Optimization Techniques
- **Bundle Splitting**: Separate vendor and app bundles
- **Tree Shaking**: Remove unused code automatically
- **Image Optimization**: WebP format with fallbacks
- **Lazy Loading**: Components and routes loaded on demand
- **Memoization**: React.memo and useMemo for expensive operations

### Performance Monitoring
```javascript
// Core Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🔒 Security Architecture

### Client-Side Security
- **XSS Prevention**: Content sanitization with DOMPurify
- **CSRF Protection**: Token-based validation
- **Input Validation**: Zod schemas for all forms
- **Secure Storage**: Sensitive data in httpOnly cookies

### Authentication Flow
```
1. User Login → Credentials sent to backend
2. Backend validates → Returns JWT token + httpOnly cookie
3. Frontend stores user data → RTK Query includes credentials
4. Protected routes → Check authentication state
5. Token refresh → Automatic renewal on API calls
```

## 📱 Mobile Architecture

### Responsive Design Strategy
```scss
// Mobile-first breakpoints
.component {
  // Mobile styles (default)
  @apply p-4 text-sm;
  
  // Tablet and up
  @screen md {
    @apply p-6 text-base;
  }
  
  // Desktop and up
  @screen lg {
    @apply p-8 text-lg;
  }
}
```

### Touch-Friendly Interface
- **Minimum tap targets**: 44px × 44px
- **Swipe gestures**: Carousel navigation
- **Pull-to-refresh**: Data reloading
- **Accessible focus**: Keyboard navigation support

## 🤖 AI Agent Architecture

### Real-time Communication
```javascript
// Socket.IO integration
const socket = io(BASE_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling']
});

// Event handling
socket.on('agent_message', handleAgentMessage);
socket.on('admin_status', updateAdminStatus);
socket.emit('user_message', { room, message });
```

### Conversation Flow
```
1. User opens chat → Join room with unique ID
2. Local intent detection → Quick responses for common queries
3. Complex queries → Forward to admin queue
4. Admin response → Real-time delivery to user
5. Conversation end → Store transcript and email
```

## 📊 Analytics Architecture

### Event Tracking
```javascript
// Custom analytics wrapper
const analytics = {
  track: (event, properties) => {
    // Send to multiple providers
    gtag('event', event, properties);
    mixpanel.track(event, properties);
  },
  
  page: (name, properties) => {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: name,
      ...properties
    });
  }
};
```

### Key Metrics
- **User Engagement**: Page views, session duration
- **Conversion Funnels**: Quote requests, career applications
- **Performance Metrics**: Core Web Vitals, API response times
- **Error Tracking**: JavaScript errors, API failures

## 🔄 Build Architecture

### Vite Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          utils: ['date-fns', 'lodash']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
```

### Deployment Pipeline
```
1. Code Push → GitHub Actions trigger
2. Install Dependencies → npm ci --legacy-peer-deps
3. Run Tests → npm run test:ci
4. Build Application → npm run build
5. Deploy to Vercel → Automatic deployment
6. Performance Audit → Lighthouse CI
```

## 🧪 Testing Architecture

### Testing Strategy
```
Unit Tests (70%)
├── Utility functions
├── Custom hooks
├── Pure components
└── Business logic

Integration Tests (20%)
├── API integration
├── Form workflows
├── User interactions
└── Route transitions

End-to-End Tests (10%)
├── Critical user paths
├── Payment flows
├── Admin workflows
└── Cross-browser compatibility
```

### Testing Tools
- **Unit Testing**: Vitest + React Testing Library
- **Integration Testing**: MSW for API mocking
- **E2E Testing**: Playwright
- **Visual Testing**: Chromatic for Storybook

## 📈 Scalability Considerations

### Horizontal Scaling
- **CDN Distribution**: Static assets via Vercel Edge Network
- **API Caching**: Redis caching for frequently accessed data
- **Database Optimization**: Proper indexing and query optimization
- **Load Balancing**: Multiple backend instances

### Code Scalability
- **Modular Architecture**: Feature-based organization
- **Design System**: Consistent, reusable components
- **API Standardization**: RESTful conventions
- **Documentation**: Comprehensive guides and examples

---

This architecture supports Khisima's mission to provide world-class language services while maintaining high performance, security, and user experience standards.