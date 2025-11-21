import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { authStatus, redirectToUmsLogin } = useAuth();

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      redirectToUmsLogin();
    }
  }, [authStatus, redirectToUmsLogin]);

  if (authStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-lg text-muted-foreground">Loading authentication...</p>
      </div>
    );
  }

  if (authStatus === 'authenticated') {
    return <>{children}</>;
  }

  // Render null or a loading spinner while redirecting for the 'unauthenticated' case
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <p className="text-lg text-muted-foreground">Redirecting to login...</p>
    </div>
  );
};

export default ProtectedRoute;
