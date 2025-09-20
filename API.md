# API Documentation

This document outlines the API endpoints and integration patterns used in the Khisima frontend application.

## 🌐 Base Configuration

### Environment Variables
```env
# Required
VITE_APP_API_BASE_URL=http://localhost:5000

# Optional
VITE_PUBLIC_S3_BUCKET_NAME_IMAGES=khisima-images
```

### Base URLs
- **API Base**: `${VITE_APP_API_BASE_URL}` (default: http://localhost:5000)
- **S3 Storage**: `https://${bucket}.t3.storage.dev`

## 🔐 Authentication

### Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Authentication Flow
```javascript
// Login example
const loginUser = async (credentials) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  return response.json();
};
```

## 📧 Notifications & Contact

### Endpoints
- `POST /api/notifications/contact` - Submit contact form
- `GET /api/notifications` - Get all notifications (admin)
- `PUT /api/notifications/:id` - Update notification
- `DELETE /api/notifications/:id` - Delete notification
- `POST /api/notifications/bulk/update` - Bulk update
- `POST /api/notifications/bulk/delete` - Bulk delete
- `PUT /api/notifications/:id/mark-read` - Mark as read
- `PUT /api/notifications/:id/respond` - Mark as responded
- `GET /api/notifications/dashboard` - Get stats
- `GET /api/notifications/export` - Export notifications

### Contact Form Structure
```javascript
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Translation Services",
  "message": "I need translation services for...",
  "phone": "+250789123456",
  "company": "Example Corp"
}
```

## 💼 Quotes Management

### Endpoints
- `POST /api/quotes` - Submit quote request
- `GET /api/quotes` - Get all quotes (admin)
- `GET /api/quotes/:id` - Get specific quote
- `PUT /api/quotes/:id` - Update quote
- `DELETE /api/quotes/:id` - Delete quote
- `GET /api/quotes/stats` - Get quote statistics

### Quote Request Structure
```javascript
{
  "contactInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+250789123456",
    "company": "Example Corp",
    "country": "Rwanda"
  },
  "projectDetails": {
    "serviceType": "translation",
    "sourceLanguages": ["English"],
    "targetLanguages": ["Kinyarwanda", "French"],
    "domain": "marketing",
    "wordCount": "5000",
    "deadline": "2024-01-31",
    "budget": "$1,000 - $2,500"
  },
  "files": ["file1.pdf", "file2.docx"],
  "additionalInfo": {
    "description": "Marketing materials translation",
    "specialRequirements": "Cultural adaptation needed",
    "timeline": "flexible",
    "previousExperience": "first-time"
  }
}
```

## 👥 Career Management

### Endpoints
- `POST /api/careers/apply` - Submit job application
- `GET /api/careers/applications` - Get all applications (admin)
- `GET /api/careers/applications/:id` - Get specific application
- `PUT /api/careers/applications/:id` - Update application
- `DELETE /api/careers/applications/:id` - Delete application
- `PUT /api/careers/applications/:id/status` - Update status
- `GET /api/careers/applications/:id/download` - Download resume
- `GET /api/careers/stats` - Get career statistics

### Application Structure
```javascript
{
  "personalInfo": {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "+250789123456",
    "country": "Rwanda",
    "city": "Kigali"
  },
  "professionalInfo": {
    "position": "Language Data Specialist",
    "experience": "3-5 years",
    "languages": ["English", "Kinyarwanda", "French"],
    "expectedSalary": "$30,000 - $40,000",
    "availability": "immediate",
    "workType": "remote"
  },
  "documents": {
    "resumeFile": "resume.pdf",
    "coverLetter": "I am interested in...",
    "portfolioUrl": "https://portfolio.com"
  }
}
```

## 🛠 Services & Solutions

### Service Management
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get specific service
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)
- `GET /api/services/category/:categoryId` - Get by category

### Solution Management
- `GET /api/solutions` - Get all solutions
- `GET /api/solutions/:id` - Get specific solution
- `POST /api/solutions` - Create solution (admin)
- `PUT /api/solutions/:id` - Update solution (admin)
- `DELETE /api/solutions/:id` - Delete solution (admin)

### Service Structure
```javascript
{
  "title": "Document Translation",
  "description": "Professional document translation services",
  "category": "translation",
  "features": [
    "Native speaker translators",
    "Quality assurance",
    "Fast turnaround"
  ],
  "pricing": {
    "startingPrice": 50,
    "currency": "USD",
    "unit": "per 1000 words"
  },
  "languages": ["English", "French", "Kinyarwanda"],
  "status": "active"
}
```

## 🤖 AI Agent System

### Endpoints
- `GET /api/agent/status` - Get agent presence status
- `PUT /api/agent/status` - Update agent status
- `GET /api/agent/search` - Search knowledge base
- `POST /api/agent/inbox` - Create inbox entry
- `GET /api/agent/inbox` - Get inbox entries
- `PUT /api/agent/inbox/:id` - Update inbox entry

### Room Management
- `GET /api/agent/rooms` - Get chat rooms
- `GET /api/agent/rooms/:roomId/messages` - Get room messages
- `POST /api/agent/rooms/:roomId/forward` - Forward to human agent
- `DELETE /api/agent/rooms/:roomId` - Delete room

### Real-time Events (Socket.IO)
```javascript
// Client-side socket events
socket.emit('join_room', { room: 'room_id', email: 'user@example.com' });
socket.emit('user_message', { room: 'room_id', message: 'Hello' });
socket.emit('admin_join');

// Server events
socket.on('agent_message', (data) => {
  // Handle agent response
});
socket.on('admin_status', (isOnline) => {
  // Update admin status
});
socket.on('new_user_message', (data) => {
  // Admin receives user message
});
```

## 📁 File Management

### S3/Tigris Storage
- `POST /api/s3/upload` - Upload file
- `DELETE /api/s3/delete` - Delete file

### Upload Structure
```javascript
const formData = new FormData();
formData.append('file', fileObject);
formData.append('folder', 'quotes'); // or 'careers', 'resources'

const response = await fetch(`${BASE_URL}/api/s3/upload`, {
  method: 'POST',
  body: formData,
});
```

## 🌍 Workplace & Resources

### Workplace Management
- `GET /api/workplaces` - Get workplaces
- `POST /api/workplaces` - Create workplace (admin)
- `PUT /api/workplaces/:id` - Update workplace (admin)
- `DELETE /api/workplaces/:id` - Delete workplace (admin)

### Resource Management
- `GET /api/resources` - Get resources
- `POST /api/resources` - Create resource (admin)
- `PUT /api/resources/:id` - Update resource (admin)
- `DELETE /api/resources/:id` - Delete resource (admin)

## 🤝 Partners & Subscribers

### Partner Management
- `GET /api/partners` - Get partners
- `POST /api/partners` - Create partner (admin)
- `PUT /api/partners/:id` - Update partner (admin)
- `DELETE /api/partners/:id` - Delete partner (admin)

### Newsletter Subscribers
- `POST /api/subscribers` - Subscribe to newsletter
- `GET /api/subscribers` - Get subscribers (admin)
- `DELETE /api/subscribers/:id` - Unsubscribe (admin)

## 🔍 Error Handling

### Error Response Format
```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "code": "VALIDATION_ERROR"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## 📊 Pagination

### Query Parameters
```javascript
// Example: GET /api/quotes?page=1&limit=10&sortBy=createdAt&sortOrder=desc
{
  page: 1,           // Page number (default: 1)
  limit: 10,         // Items per page (default: 10, max: 100)
  sortBy: 'createdAt', // Sort field
  sortOrder: 'desc', // Sort direction (asc/desc)
  search: 'keyword', // Search term
  status: 'pending'  // Filter by status
}
```

### Response Format
```javascript
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## 🔧 RTK Query Integration

### API Slice Setup
```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Quote', 'Career', 'Service', 'Notification'],
  endpoints: (builder) => ({
    // Endpoints defined here
  }),
});
```

### Example Query Hook
```javascript
export const {
  useGetQuotesQuery,
  useCreateQuoteMutation,
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
} = quotesApiSlice;

// Usage in component
const {
  data: quotes,
  isLoading,
  isError,
  error,
  refetch
} = useGetQuotesQuery({
  page: 1,
  limit: 10,
  status: 'pending'
});
```

## 🛡 Security Considerations

### CORS Configuration
```javascript
// Backend CORS setup
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Authentication Headers
```javascript
// Include credentials for authenticated requests
credentials: 'include'

// Or use Authorization header
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Input Validation
- All inputs are validated on both client and server
- File uploads are restricted by type and size
- XSS protection through content sanitization
- CSRF protection via cookies and headers

---

For additional API details or integration support, contact: tech@khisima.com