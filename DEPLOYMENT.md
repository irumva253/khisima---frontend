# Deployment Guide

This guide covers deployment strategies and configurations for the Khisima Language Service Provider frontend application.

## 🚀 Deployment Options

### 1. Vercel (Recommended)

Vercel provides seamless deployment with automatic builds, preview deployments, and global CDN distribution.

#### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/irumva253/khisima---frontend)

#### Manual Deployment Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Directory**
   ```bash
   cd khisima---frontend
   vercel
   ```

4. **Configure Environment Variables**
   ```bash
   vercel env add VITE_APP_API_BASE_URL
   vercel env add VITE_PUBLIC_S3_BUCKET_NAME_IMAGES
   ```

#### Vercel Configuration (`vercel.json`)
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install --legacy-peer-deps",
  "devCommand": "npm run dev",
  "env": {
    "VITE_APP_API_BASE_URL": "@vite_app_api_base_url",
    "VITE_PUBLIC_S3_BUCKET_NAME_IMAGES": "@vite_public_s3_bucket_name_images"
  },
  "build": {
    "env": {
      "VITE_APP_API_BASE_URL": "@vite_app_api_base_url",
      "VITE_PUBLIC_S3_BUCKET_NAME_IMAGES": "@vite_public_s3_bucket_name_images"
    }
  },
  "functions": {
    "app/api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

### 2. Netlify

Alternative hosting platform with similar features to Vercel.

#### Deploy Steps
1. **Connect Repository**
   - Go to [Netlify](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Configuration**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   ```
   VITE_APP_API_BASE_URL=https://api.khisima.com
   VITE_PUBLIC_S3_BUCKET_NAME_IMAGES=khisima-prod-images
   ```

#### Netlify Configuration (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 3. AWS S3 + CloudFront

For enterprise deployments requiring AWS infrastructure.

#### Prerequisites
- AWS CLI configured
- S3 bucket created
- CloudFront distribution set up

#### Deployment Script
```bash
#!/bin/bash

# Build the application
npm run build

# Sync to S3 bucket
aws s3 sync dist/ s3://khisima-frontend-prod --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

### 4. Docker Deployment

For containerized deployments.

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration (`nginx.conf`)
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

#### Docker Compose
```yaml
version: '3.8'

services:
  khisima-frontend:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  # Optional: Add backend service
  khisima-backend:
    image: khisima/backend:latest
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://...
    restart: unless-stopped
```

## 🔧 Environment Configuration

### Development Environment
```env
VITE_APP_API_BASE_URL=http://localhost:5000
VITE_PUBLIC_S3_BUCKET_NAME_IMAGES=khisima-dev-images
NODE_ENV=development
```

### Staging Environment
```env
VITE_APP_API_BASE_URL=https://staging-api.khisima.com
VITE_PUBLIC_S3_BUCKET_NAME_IMAGES=khisima-staging-images
NODE_ENV=staging
```

### Production Environment
```env
VITE_APP_API_BASE_URL=https://api.khisima.com
VITE_PUBLIC_S3_BUCKET_NAME_IMAGES=khisima-prod-images
NODE_ENV=production
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

#### `.github/workflows/deploy.yml`
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci --legacy-peer-deps
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm run test:ci
    
    - name: Build application
      run: npm run build
      env:
        VITE_APP_API_BASE_URL: ${{ secrets.VITE_APP_API_BASE_URL }}
        VITE_PUBLIC_S3_BUCKET_NAME_IMAGES: ${{ secrets.VITE_PUBLIC_S3_BUCKET_NAME_IMAGES }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

### Pre-deployment Checklist

#### Code Quality
- [ ] All tests passing
- [ ] Linting rules followed
- [ ] No console.log statements in production code
- [ ] Error boundaries implemented
- [ ] Loading states handled

#### Performance
- [ ] Bundle size optimized
- [ ] Images optimized and compressed
- [ ] Lazy loading implemented
- [ ] Core Web Vitals scores acceptable
- [ ] Lighthouse audit passing

#### Security
- [ ] Environment variables configured
- [ ] API keys secured
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Input validation implemented

#### Functionality
- [ ] All features working as expected
- [ ] Cross-browser compatibility tested
- [ ] Mobile responsiveness verified
- [ ] Forms validation working
- [ ] API integration tested

## 📊 Monitoring & Analytics

### Error Tracking
```javascript
// Sentry configuration
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring
```javascript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Health Checks
```javascript
// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV
  });
});
```

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Clear build cache
rm -rf dist .vite

# Rebuild
npm run build
```

#### Environment Variable Issues
```bash
# Check if variables are loaded
console.log('API Base URL:', import.meta.env.VITE_APP_API_BASE_URL);

# Verify in production build
npm run build && npm run preview
```

#### CORS Issues
```javascript
// Backend CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### Performance Issues
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Check for unused dependencies
npx depcheck

# Optimize images
npx imagemin-cli --plugin=imagemin-webp src/assets/images/* --out-dir=src/assets/images/optimized
```

## 📋 Deployment Checklist

### Pre-deployment
- [ ] Code review completed
- [ ] Tests passing locally
- [ ] Environment variables configured
- [ ] Dependencies updated and secure
- [ ] Performance audit completed

### Deployment
- [ ] Build successful
- [ ] Deployment pipeline executed
- [ ] Health checks passing
- [ ] DNS configured correctly
- [ ] SSL certificate valid

### Post-deployment
- [ ] Application accessible
- [ ] All features working
- [ ] Analytics tracking
- [ ] Error monitoring active
- [ ] Performance metrics baseline

### Rollback Plan
```bash
# Vercel rollback
vercel rollback --target=production

# Manual rollback
git revert HEAD
git push origin main

# Docker rollback
docker pull khisima/frontend:previous-tag
docker-compose up -d
```

---

For deployment support or issues, contact: devops@khisima.com