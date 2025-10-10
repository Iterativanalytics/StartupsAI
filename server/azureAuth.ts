import { ConfidentialClientApplication, Configuration } from "@azure/msal-node";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";
import { handleDevelopmentAuth, sendUnauthorizedResponse } from "./utils/authUtils";

// Azure AD configuration
const azureConfig: Configuration = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID || '',
    clientSecret: process.env.AZURE_CLIENT_SECRET || '',
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID || 'common'}`,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        if (process.env.NODE_ENV === 'development') {
          console.log(message);
        }
      },
      piiLoggingEnabled: false,
      logLevel: 3, // Info
    }
  }
};

// Initialize MSAL instance
let msalInstance: ConfidentialClientApplication | null = null;

export function getMsalInstance(): ConfidentialClientApplication {
  if (!msalInstance) {
    msalInstance = new ConfidentialClientApplication(azureConfig);
  }
  return msalInstance;
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  return session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

export async function setupAzureAuth(app: Express) {
  // Skip auth setup if Azure credentials are not configured
  if (!process.env.AZURE_CLIENT_ID || !process.env.AZURE_CLIENT_SECRET) {
    console.log("Skipping Azure auth setup - Azure credentials not configured");
    return;
  }

  app.set("trust proxy", 1);
  app.use(getSession());

  const msalInstance = getMsalInstance();
  const redirectUri = process.env.AZURE_REDIRECT_URI || "http://localhost:5000/api/auth/azure/callback";

  // Azure login route
  app.get("/api/auth/azure", async (req, res) => {
    try {
      const authCodeUrlParameters = {
        scopes: ["user.read", "profile", "email", "openid"],
        redirectUri: redirectUri,
        prompt: "select_account",
      };

      const authCodeUrl = await msalInstance.getAuthCodeUrl(authCodeUrlParameters);
      res.redirect(authCodeUrl);
    } catch (error) {
      console.error("Azure auth initiation error:", error);
      res.status(500).json({ message: "Failed to initiate Azure authentication" });
    }
  });

  // Azure callback route
  app.get("/api/auth/azure/callback", async (req, res) => {
    try {
      const tokenRequest = {
        code: req.query.code as string,
        scopes: ["user.read", "profile", "email", "openid"],
        redirectUri: redirectUri,
      };

      const response = await msalInstance.acquireTokenByCode(tokenRequest);
      
      if (response && response.account) {
        // Store user info in session
        (req.session as any).user = {
          account: response.account,
          accessToken: response.accessToken,
          idToken: response.idToken,
          claims: response.idTokenClaims,
        };

        // Create or update user in storage
        await upsertUser(response.account, response.idTokenClaims);

        res.redirect("/");
      } else {
        res.status(400).json({ message: "Failed to acquire token" });
      }
    } catch (error) {
      console.error("Azure auth callback error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Azure logout route
  app.get("/api/auth/azure/logout", (req, res) => {
    const user = (req.session as any).user;
    
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
      }
      
      if (user && user.account) {
        const logoutUri = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID || 'common'}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(process.env.AZURE_POST_LOGOUT_REDIRECT_URI || "http://localhost:5000")}`;
        res.redirect(logoutUri);
      } else {
        res.redirect("/");
      }
    });
  });
}

async function upsertUser(account: any, claims: any) {
  try {
    await storage.upsertUser({
      id: account.localAccountId || account.homeAccountId,
      email: account.username || claims?.preferred_username || claims?.email,
      firstName: claims?.given_name,
      lastName: claims?.family_name,
      profileImageUrl: null,
    });
  } catch (error) {
    console.error("Error upserting user:", error);
  }
}

export const isAzureAuthenticated: RequestHandler = async (req, res, next) => {
  // Use test authentication token in development mode
  if (process.env.NODE_ENV === 'development') {
    return handleDevelopmentAuth(req, res, next);
  }

  const sessionUser = (req.session as any)?.user;

  if (!sessionUser || !sessionUser.account) {
    return sendUnauthorizedResponse(res, "Unauthorized - please log in");
  }

  // Check if token is still valid (simple check)
  if (sessionUser.accessToken) {
    req.user = {
      claims: {
        sub: sessionUser.account.localAccountId || sessionUser.account.homeAccountId,
        email: sessionUser.account.username || sessionUser.claims?.preferred_username,
        given_name: sessionUser.claims?.given_name,
        family_name: sessionUser.claims?.family_name,
        profile_image_url: null,
        user_type: 'entrepreneur'
      }
    };
    return next();
  }

  return sendUnauthorizedResponse(res, "Unauthorized - token expired");
};

// Get current user info
export const getCurrentUser: RequestHandler = (req, res) => {
  const sessionUser = (req.session as any)?.user;
  
  if (!sessionUser) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json({
    id: sessionUser.account.localAccountId || sessionUser.account.homeAccountId,
    email: sessionUser.account.username || sessionUser.claims?.preferred_username,
    firstName: sessionUser.claims?.given_name,
    lastName: sessionUser.claims?.family_name,
    profileImageUrl: null,
  });
};
