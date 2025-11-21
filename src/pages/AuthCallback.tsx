import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const REDIRECT_PATH_KEY = 'redirectPath';

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAccessToken, redirectToUmsLogin } = useAuth();

  useEffect(() => {
    // Support both implicit flow hash (#access_token=...) and query param (?token=...)
    const { hash, search } = location;

    let accessToken: string | null = null;
    let expiresIn: string | null = null;

    // 1) Try hash fragment (e.g., #access_token=...&expires_in=...)
    if (hash && hash.startsWith('#')) {
      const hashParams = new URLSearchParams(hash.substring(1));
      accessToken = hashParams.get('access_token');
      expiresIn = hashParams.get('expires_in');
    }

    // 2) Fallback to query param (e.g., ?token=...)
    if (!accessToken && search) {
      const queryParams = new URLSearchParams(search);
      accessToken = queryParams.get('token');
      // Some providers also return expires_in as a query param
      if (!expiresIn) {
        expiresIn = queryParams.get('expires_in');
      }
    }

    if (accessToken) {
      setAccessToken(accessToken);
      // TODO: optionally store expiresIn -> compute expires_at = now + expiresIn
      const redirectPath = localStorage.getItem(REDIRECT_PATH_KEY) || '/';
      localStorage.removeItem(REDIRECT_PATH_KEY); // Clean up
      toast.success('Successfully logged in! Redirecting...');
      navigate(redirectPath, { replace: true });
      return;
    }

    // If we reach here, no token was found in either hash or query
    toast.error('Authentication failed: No access token found in URL.');
    redirectToUmsLogin();
  }, [location, navigate, setAccessToken, redirectToUmsLogin]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <p className="text-lg text-muted-foreground">Processing authentication...</p>
    </div>
  );
};

export default AuthCallback;
