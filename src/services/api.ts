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

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort('Request timed out after 20 seconds');
    }, 20000);
    
    const response = await fetch(url, { 
      ...config, 
      signal: controller.signal 
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.json();
        const possibleMessage = 
          (typeof errorBody === 'string' ? errorBody : null) ||
          errorBody?.message ||
          errorBody?.detail ||
          errorBody?.error ||
          errorBody?.errors?.[0]?.message;
        if (possibleMessage) {
          errorMessage = possibleMessage;
        }
      } catch (e) {
        // Ignore JSON parsing errors
      }
      throw new Error(errorMessage);
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
    // Don't log aborted requests as errors
    if (error instanceof Error && error.name === 'AbortError') {
      // Re-throw with a more descriptive message
      throw new Error(`Request was aborted: ${error.message || 'Component unmounted or request cancelled'}`);
    }
    console.error('API request failed:', error);
    throw error;
  }
};
