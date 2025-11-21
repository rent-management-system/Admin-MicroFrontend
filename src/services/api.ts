// src/services/api.ts

// Prefer configuration via Vite env, fallback to local FastAPI default.
// Example: VITE_API_BASE_URL=http://localhost:8015
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${window.location.protocol}//${window.location.hostname}:8015`;

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
  const url = `${API_BASE_URL}${endpoint}`;

  // Default headers
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Add the Authorization header if a token exists
  if (token) {
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
    // Add a 20s timeout to avoid hanging requests
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    const response = await fetch(url, { ...config, signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      // Attempt to parse error response from the body, otherwise use status text
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorMessage;
      } catch (e) {
        // Ignore if the error response is not valid JSON
      }
      throw new Error(errorMessage);
    }

    // If the response has no content, return an empty object to avoid parsing errors
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json() as T;
    }
    // Fallback to text for non-JSON endpoints (cast to T)
    const text = await response.text();
    return text as unknown as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
