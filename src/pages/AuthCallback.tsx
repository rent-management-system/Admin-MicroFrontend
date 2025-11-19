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
    const hash = location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // Remove '#'
      const accessToken = params.get('access_token');
      const expiresIn = params.get('expires_in'); // Not directly used for now, but good to extract

      if (accessToken) {
        setAccessToken(accessToken);
        const redirectPath = localStorage.getItem(REDIRECT_PATH_KEY) || '/';
        localStorage.removeItem(REDIRECT_PATH_KEY); // Clean up
        toast.success('Successfully logged in!');
        navigate(redirectPath, { replace: true });
      } else {
        toast.error('Authentication failed: No access token found.');
        redirectToUmsLogin(); // Redirect to UMS login if token is missing
      }
    } else {
      toast.error('Authentication failed: No hash fragment found in URL.');
      redirectToUmsLogin(); // Redirect to UMS login if no hash
    }
  }, [location.hash, navigate, setAccessToken, redirectToUmsLogin]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <p className="text-lg text-muted-foreground">Processing authentication...</p>
    </div>
  );
};

export default AuthCallback;
