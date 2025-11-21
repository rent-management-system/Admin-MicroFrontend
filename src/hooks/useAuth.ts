import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  accessToken: string | null;
  authStatus: AuthStatus;
  setAccessToken: (token: string | null) => void;
  getAccessToken: () => string | null;
  logout: () => void;
  redirectToUmsLogin: () => void;
}

const AUTH_TOKEN_KEY = 'access_token';
const REDIRECT_PATH_KEY = 'redirectPath';

// Auth configuration via Vite env vars
// Configure these in .env.local for local dev and in Vercel project settings for production
const UMS_LOGIN_URL = import.meta.env.VITE_UMS_LOGIN_URL || 'https://rent-managment-system-user-magt.onrender.com/';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || 'YOUR_NEW_CLIENT_ID';
const AUTH_CALLBACK_PATH = import.meta.env.VITE_AUTH_CALLBACK_PATH || '/auth/callback';
// Optionally override the base used to compute redirect_uri (useful if your IdP expects a specific port)
const REDIRECT_BASE = import.meta.env.VITE_REDIRECT_BASE || window.location.origin;
// Bypass auth in local development to run frontend without backend login
const BYPASS_AUTH = (import.meta.env.VITE_BYPASS_AUTH === 'true');

export const useAuth = (): AuthContextType => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const navigate = useNavigate();

  // Function to get the token from localStorage
  const getAccessToken = useCallback(() => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }, []);

  // Function to set the token in localStorage and update state
  const setAccessToken = useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      setAccessTokenState(token);
      setAuthStatus('authenticated');
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setAccessTokenState(null);
      setAuthStatus('unauthenticated');
    }
  }, []);

  // Function to clear token and redirect to login
  const logout = useCallback(() => {
    setAccessToken(null);
    localStorage.removeItem(REDIRECT_PATH_KEY);
    toast.info('You have been logged out.');
    // Redirect to the root or a specific login page if needed
    navigate('/', { replace: true });
  }, [setAccessToken, navigate]);

  // Function to redirect to UMS login page
  const redirectToUmsLogin = useCallback(() => {
    if (BYPASS_AUTH) {
      // Skip redirect entirely in bypass mode
      console.warn('[Auth] Bypass enabled: skipping redirect to UMS login');
      return;
    }
    // Don't redirect if we are already on the callback page
    if (window.location.pathname === AUTH_CALLBACK_PATH) return;
    
    localStorage.setItem(REDIRECT_PATH_KEY, window.location.pathname + window.location.search); // Save current path
    const redirectUri = encodeURIComponent(`${REDIRECT_BASE}${AUTH_CALLBACK_PATH}`);
    window.location.href = `${UMS_LOGIN_URL}?redirect_uri=${redirectUri}&client_id=${CLIENT_ID}&response_type=token`;
  }, []);

  // Initialize access token from localStorage on component mount
  useEffect(() => {
    try {
      const storedToken = getAccessToken();
      if (storedToken) {
        setAccessTokenState(storedToken);
        setAuthStatus('authenticated');
      } else {
        if (BYPASS_AUTH) {
          console.warn('[Auth] Bypass enabled: setting mock access token for local development');
          const mock = 'dev-mock-access-token';
          localStorage.setItem(AUTH_TOKEN_KEY, mock);
          setAccessTokenState(mock);
          setAuthStatus('authenticated');
        } else {
          setAuthStatus('unauthenticated');
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      setAuthStatus('unauthenticated');
    }
  }, [getAccessToken]);

  return {
    accessToken,
    authStatus,
    setAccessToken,
    getAccessToken,
    logout,
    redirectToUmsLogin,
  };
};
