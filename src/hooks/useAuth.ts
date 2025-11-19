import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  getAccessToken: () => string | null;
  logout: () => void;
  redirectToUmsLogin: () => void;
}

const AUTH_TOKEN_KEY = 'access_token';
const REDIRECT_PATH_KEY = 'redirectPath';
const UMS_LOGIN_URL = 'https://your-ums.com/login'; // TODO: Replace with actual UMS login URL
const CLIENT_ID = 'YOUR_NEW_CLIENT_ID'; // TODO: Replace with actual client ID

export const useAuth = (): AuthContextType => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
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
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setAccessTokenState(null);
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
    localStorage.setItem(REDIRECT_PATH_KEY, window.location.pathname); // Save current path
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
    window.location.href = `${UMS_LOGIN_URL}?redirect_uri=${redirectUri}&client_id=${CLIENT_ID}&response_type=token`;
  }, []);

  // Initialize access token from localStorage on component mount
  useEffect(() => {
    const storedToken = getAccessToken();
    if (storedToken) {
      setAccessTokenState(storedToken);
    }
  }, [getAccessToken]);

  return {
    accessToken,
    setAccessToken,
    getAccessToken,
    logout,
    redirectToUmsLogin,
  };
};
