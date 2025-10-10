# Azure Authentication Implementation

This document describes the Azure Active Directory (Azure AD) authentication implementation for the IterativStartups application.

## Overview

Azure Authentication has been successfully integrated into the application, providing users with the ability to sign in using their Microsoft accounts through Azure Active Directory.

## Features Implemented

### 🔐 Server-Side Authentication

1. **Azure AD Configuration** (`server/azureAuth.ts`)
   - MSAL (Microsoft Authentication Library) integration
   - Configurable tenant support (single-tenant, multi-tenant, or common)
   - Secure session management
   - Token refresh handling

2. **Authentication Middleware** (`server/auth-middleware.ts`)
   - Support for both Google OAuth and Azure AD
   - Development mode with mock authentication
   - Production mode with full authentication validation
   - Unified user object format across authentication providers

3. **User Management**
   - Automatic user creation/update on first login
   - User profile synchronization with Azure AD
   - Storage integration for persistent user data

### 🎨 Client-Side Components

1. **Azure Sign-In Component** (`client/src/components/AzureSignIn.tsx`)
   - Customizable button with Microsoft branding
   - Configurable variants and sizes
   - Integrated with application design system

2. **Updated Login Page** (`client/src/pages/login.tsx`)
   - Support for both Google and Azure authentication
   - Clean, professional design with proper separation
   - Responsive layout

3. **Protected Routes** (`client/src/components/ProtectedRoute.tsx`)
   - Support for multiple authentication providers
   - Consistent user experience across auth methods

## API Endpoints

The following authentication endpoints are available:

### Azure Authentication
- `GET /api/auth/azure` - Initiate Azure AD login
- `GET /api/auth/azure/callback` - Handle OAuth callback from Azure AD
- `GET /api/auth/azure/logout` - Logout and redirect to Azure AD logout

### User Information
- `GET /api/user` - Get current user information (supports both Google and Azure users)

## Environment Configuration

Required environment variables for Azure Authentication:

```env
# Azure AD Authentication
AZURE_TENANT_ID=your-tenant-id-here
AZURE_CLIENT_ID=your-client-id-here
AZURE_CLIENT_SECRET=your-client-secret-here
AZURE_REDIRECT_URI=http://localhost:5000/api/auth/azure/callback
AZURE_POST_LOGOUT_REDIRECT_URI=http://localhost:5000

# Session Secret (required for session management)
SESSION_SECRET=your-secure-session-secret-here
```

## How It Works

### Authentication Flow

1. **Login Initiation**: User clicks "Sign in with Microsoft" button
2. **Azure Redirect**: Application redirects to Azure AD login page
3. **User Authentication**: User enters Microsoft credentials
4. **Authorization Code**: Azure AD redirects back with authorization code
5. **Token Exchange**: Application exchanges code for access token and user info
6. **User Creation/Update**: User information is stored/updated in the application
7. **Session Creation**: Secure session is created for the user
8. **Application Access**: User can now access protected routes

### User Data Mapping

Azure AD user claims are mapped to the application's user format:

```typescript
{
  sub: account.localAccountId || account.homeAccountId,
  email: account.username || claims.preferred_username,
  first_name: claims.given_name,
  last_name: claims.family_name,
  profile_image_url: null, // Can be extended to include Azure profile photo
  user_type: 'entrepreneur' // Default user type
}
```

## Multi-Provider Support

The application now supports multiple authentication providers:

1. **Google OAuth** - Existing implementation
2. **Azure AD** - New implementation
3. **Development Mode** - Mock authentication for development

The authentication middleware automatically detects which provider was used and handles the user accordingly.

## Security Features

1. **Secure Session Management**
   - HttpOnly cookies
   - Secure flag in production
   - Configurable session timeout (1 week default)

2. **Token Validation**
   - Automatic token refresh
   - Secure token storage in server sessions
   - No sensitive data exposed to client

3. **Environment-Based Configuration**
   - Different settings for development/production
   - Secure secret management
   - Optional authentication in development

## Production Deployment

For production deployment:

1. **Azure AD App Registration**
   - Register your application in Azure Portal
   - Configure production redirect URIs
   - Set up proper permissions

2. **Environment Variables**
   - Use secure secret management (Azure Key Vault, etc.)
   - Set production redirect URIs
   - Configure proper session secrets

3. **HTTPS Configuration**
   - Ensure all redirect URIs use HTTPS
   - Configure secure cookies
   - Set up proper CORS policies

## Testing

### Development Mode
- Automatic mock authentication
- No Azure credentials required
- Immediate access to protected routes

### Production Mode
- Full Azure AD integration
- Requires proper Azure app registration
- Complete OAuth 2.0 flow

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch"**
   - Verify redirect URI matches Azure AD configuration exactly
   - Check for trailing slashes and http vs https

2. **"invalid_client"**
   - Verify client ID and secret are correct
   - Check that client secret hasn't expired

3. **Session Not Persisting**
   - Ensure SESSION_SECRET is set
   - Check cookie configuration
   - Verify secure flag settings for your environment

### Debug Information

Enable debug logging by setting `NODE_ENV=development`. This will:
- Log MSAL authentication events
- Show session information
- Display user mapping details

## Future Enhancements

Potential improvements for the Azure Auth implementation:

1. **Multi-Tenant Support**
   - Dynamic tenant detection
   - Tenant-specific user roles
   - Organization-based access control

2. **Enhanced User Profiles**
   - Azure AD group membership
   - Profile photo integration
   - Extended user attributes

3. **Advanced Security**
   - Certificate-based authentication
   - Conditional access policies
   - Multi-factor authentication requirements

4. **Single Sign-On (SSO)**
   - Silent authentication
   - Cross-application SSO
   - Remember device functionality

## Dependencies

New packages added for Azure Authentication:

- `@azure/msal-node` - Microsoft Authentication Library for Node.js
- `@azure/msal-browser` - Microsoft Authentication Library for browser (future use)

## Documentation

For detailed setup instructions, see:
- [AZURE_AUTH_SETUP.md](./AZURE_AUTH_SETUP.md) - Complete setup guide
- [Microsoft Identity Platform Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)

## Support

Azure Authentication is now fully integrated and ready for use. The implementation follows Microsoft's best practices and security guidelines for OAuth 2.0 and OpenID Connect.



