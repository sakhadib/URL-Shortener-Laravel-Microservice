# Frontend-Backend Integration

This document describes the integration between the Next.js frontend and Laravel microservice backend.

## API Endpoints Integrated

### Authentication (Identity Service)
- ✅ `POST /api/auth/login` - User login
- ✅ `POST /api/auth/register` - User registration  
- ✅ `GET /api/me` - Get user profile
- ✅ `POST /api/auth/refresh` - Refresh token

### Link Management (Links Service)
- ✅ `POST /api/links` - Create short link
- ✅ `GET /api/links` - List user's links
- ✅ `GET /api/links/{code}` - Get link details with statistics
- ✅ `DELETE /api/links/{id}` - Delete link

### Public Access
- ✅ `GET /api/r/{code}` - Redirect to target URL

## Key Features Integrated

1. **User Authentication**
   - Login and registration forms
   - JWT token management
   - Automatic authentication checks
   - Secure API calls with Bearer tokens

2. **Link Management**
   - Create shortened links with optional custom codes
   - View all user links in dashboard
   - Copy short URLs to clipboard
   - Delete unwanted links
   - Real-time statistics display

3. **Analytics & Statistics**
   - Total click count per link
   - Last click timestamp
   - Link creation dates
   - Active/inactive status

4. **User Experience**
   - Loading states for all operations
   - Error handling with user-friendly messages
   - Responsive design
   - Confirmation dialogs for destructive actions

## Technical Implementation

- **API Client**: Centralized `apiClient` for all backend communication
- **TypeScript**: Full type safety with proper interfaces
- **Error Handling**: Consistent error handling across components
- **State Management**: React hooks for component state
- **Authentication**: localStorage for JWT token persistence

## Configuration

The frontend connects to the backend via:
- Base URL: `http://localhost:5050/api`
- Authentication: JWT Bearer tokens
- Content-Type: `application/json`

## Security Considerations

- JWT tokens stored in localStorage
- Automatic token removal on authentication failure
- HTTPS ready for production deployment
- CORS configuration on backend required