import { useState, useEffect } from 'react';
import { User, getMockUserById } from '@/services/mockDataService';
import { useAuth } from './useAuth';

export const useCurrentUser = () => {
  const { accessToken, authStatus } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real app, you would get the user ID from the access token
        // For mock purposes, we'll use the first user in the list
        const mockUserId = '007a9359-e9ed-475f-ac13-401ca149b67d'; // Test user ID from user.json
        const user = await getMockUserById(mockUserId);
        
        if (user) {
          setCurrentUser(user);
        } else {
          throw new Error('User not found');
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      } finally {
        setLoading(false);
      }
    };

    if (authStatus === 'authenticated') {
      fetchCurrentUser();
    } else if (authStatus === 'unauthenticated') {
      setLoading(false);
    }
  }, [authStatus, accessToken]);

  return {
    user: currentUser,
    loading,
    error,
    isAuthenticated: authStatus === 'authenticated',
  };
};

export default useCurrentUser;
