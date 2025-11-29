// src/services/api.ts

// Prefer configuration via Vite env. If not provided, use relative base '' so
// requests go to the same origin and get proxied by Vite during development.
// Example override: VITE_API_BASE_URL=http://localhost:8020
const API_BASE_URL: string = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const BYPASS_AUTH: boolean = import.meta.env.VITE_BYPASS_AUTH === 'true';

/**
 * Retrieves the authentication token from localStorage.
 * @returns The token string or null if not found.
 */
const getAuthToken = (): string | null => {
  // As defined in useAuth.ts
  return localStorage.getItem('access_token');
};

/**
 * A wrapper around the fetch API to automatically add the Authorization header.
 * It also handles common request/response logic like JSON parsing and error handling.
 *
 * @param endpoint The API endpoint to call (e.g., '/users').
 * @param options The standard fetch options (method, body, etc.).
 * @returns The JSON response from the API.
 * @throws An error if the network response is not ok.
 */
export const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token && !BYPASS_AUTH) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    // If a signal was already passed in, use that instead of our controller
    const signal = config.signal || controller.signal;
    const timeout = setTimeout(() => {
      controller.abort('Request timed out after 20 seconds');
    }, 20000);
    
    const response = await fetch(url, {
      ...config,
      signal // Use the signal in the fetch options
    });

    // Clear the timeout since the request completed
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: 'Failed to parse error response' };
      }
      const error = new Error(errorData.message || 'API request failed');
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json() as T;
    }
    const text = await response.text();
    return text as unknown as T;
  } catch (error) {
    // Clear timeout on error
    clearTimeout(timeoutId);
    
    // Don't log aborted requests as errors
    if (error instanceof Error && error.name === 'AbortError') {
      // Create a new error to preserve the stack trace
      const abortError = new Error('Request was aborted');
      abortError.name = 'AbortError';
      throw abortError;
    }
    
    // Re-throw the error to be handled by the caller
    throw error;
  } finally {
    // Cleanup
    clearTimeout(timeoutId);
  }
};
