# Azure Authentication Setup

This guide explains how to set up Microsoft Azure Active Directory (Azure AD) authentication for your application.

## Prerequisites

1. An Azure account with access to Azure Active Directory
2. Permissions to register applications in your Azure AD tenant

## Azure AD App Registration

### Step 1: Create an App Registration

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in the following:
   - **Name**: Your application name (e.g., "IterativStartups")
   - **Supported account types**: 
     - Choose "Accounts in this organizational directory only" for single tenant
     - Choose "Accounts in any organizational directory" for multi-tenant
     - Choose "Accounts in any organizational directory and personal Microsoft accounts" for the widest support
   - **Redirect URI**: 
     - Platform: Web
     - URI: `http://localhost:5000/api/auth/azure/callback` (for development)
5. Click **Register**

### Step 2: Configure Authentication

1. In your app registration, go to **Authentication**
2. Under **Redirect URIs**, add production URLs:
   - `https://yourdomain.com/api/auth/azure/callback`
3. Under **Front-channel logout URL**, add:
   - `https://yourdomain.com` (production)
   - `http://localhost:5000` (development)
4. Under **Implicit grant and hybrid flows**, enable:
   - ✅ **ID tokens** (used for sign-in)
5. Click **Save**

### Step 3: Create Client Secret

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Add a description (e.g., "App Secret")
4. Choose expiration (recommend 24 months max for security)
5. Click **Add**
6. **Important**: Copy the secret value immediately - you won't be able to see it again!

### Step 4: Configure API Permissions

1. Go to **API permissions**
2. Click **Add a permission**
3. Choose **Microsoft Graph**
4. Choose **Delegated permissions**
5. Add these permissions:
   - `User.Read` (to read user profile)
   - `email` (to access user email)
   - `openid` (for OpenID Connect)
   - `profile` (to access user profile info)
6. Click **Add permissions**
7. Optionally, click **Grant admin consent** if you have admin privileges

## Environment Configuration

Add these variables to your `.env` file:

```env
# Azure AD Authentication
AZURE_TENANT_ID=your-tenant-id-here
AZURE_CLIENT_ID=your-client-id-here
AZURE_CLIENT_SECRET=your-client-secret-here
AZURE_REDIRECT_URI=http://localhost:5000/api/auth/azure/callback
AZURE_POST_LOGOUT_REDIRECT_URI=http://localhost:5000

# Session Secret (generate a strong random string)
SESSION_SECRET=your-secure-session-secret-here
```

### Finding Your Values

- **AZURE_TENANT_ID**: Found in your app registration **Overview** page as "Directory (tenant) ID"
- **AZURE_CLIENT_ID**: Found in your app registration **Overview** page as "Application (client) ID"
- **AZURE_CLIENT_SECRET**: The secret value you copied when creating the client secret
- **AZURE_REDIRECT_URI**: Must match exactly what you configured in Azure AD
- **AZURE_POST_LOGOUT_REDIRECT_URI**: Where users go after logging out

## Production Configuration

For production deployment:

1. Update redirect URIs in Azure AD to use your production domain
2. Use environment variables or Azure Key Vault for secrets
3. Enable certificate-based authentication instead of client secrets (recommended)
4. Configure proper CORS settings
5. Use HTTPS for all redirect URIs

## Authentication Flow

1. User clicks "Sign in with Microsoft" button
2. Application redirects to Azure AD login page
3. User authenticates with Microsoft credentials
4. Azure AD redirects back to your callback URL with authorization code
5. Application exchanges code for access token and user info
6. User is logged in and session is created

## API Endpoints

The following authentication endpoints are available:

- `GET /api/auth/azure` - Initiate Azure AD login
- `GET /api/auth/azure/callback` - Handle OAuth callback
- `GET /api/auth/azure/logout` - Logout and clear session

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**
   - Ensure the redirect URI in your code exactly matches what's registered in Azure AD
   - Check for trailing slashes and http vs https

2. **"invalid_client" error**
   - Verify your client ID and client secret are correct
   - Check that the client secret hasn't expired

3. **"unauthorized_client" error**
   - Ensure your app has the required API permissions
   - Try granting admin consent for the permissions

4. **Session not persisting**
   - Check that SESSION_SECRET is set
   - Verify cookies are being set correctly (check browser dev tools)

### Debug Mode

To enable debug logging, set `NODE_ENV=development` in your environment variables.

## Security Best Practices

1. **Never expose client secrets** in client-side code
2. **Use HTTPS** in production
3. **Rotate client secrets** regularly
4. **Use certificate authentication** instead of client secrets for production
5. **Implement proper session management** with secure cookies
6. **Validate tokens** on the server side
7. **Use least-privilege permissions** - only request the API permissions you need

## Multi-Tenant Support

If you need to support users from multiple Azure AD tenants:

1. Set the authority URL to use "common" tenant:
   ```
   authority: 'https://login.microsoftonline.com/common'
   ```

2. Update your app registration to support "Accounts in any organizational directory"

3. Handle tenant-specific logic in your application code

## Next Steps

After setting up Azure Authentication:

1. Test the login flow in development
2. Configure user role management
3. Set up proper authorization rules
4. Implement user profile management
5. Add logout functionality
6. Configure production deployment

For more information, see the [Microsoft identity platform documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/).



