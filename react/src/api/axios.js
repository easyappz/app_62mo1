/** Не меняй код этого файла никогда */
/** Если нужно добавить еще обработчики можешь их добавить в отдельном файле, используя interceptors */
import axios from 'axios';

/**
 * Axios instance configuration with base URL, authentication credentials, and response interceptors
 */
export const instance = axios.create({
  timeout: 30000,
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for broadcasting logout to the app without direct imports
const broadcastLogout = () => {
  try {
    window.dispatchEvent(new CustomEvent('auth:logout'));
  } catch (e) {
    // fallback event
    window.dispatchEvent(new Event('auth:logout'));
  }
};

// Prevent parallel refresh calls
let refreshPromise = null;
const performRefresh = async () => {
  if (refreshPromise) return refreshPromise;
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    broadcastLogout();
    return Promise.reject(new Error('No refresh token'));
  }
  // Use a plain axios call to avoid interceptor recursion
  refreshPromise = axios.post('/api/auth/refresh', { refresh: refreshToken }, {
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => {
    const data = res?.data || {};
    const newAccess = data.access || data.access_token || data.token || data.jwt;
    const newRefresh = data.refresh || data.refresh_token || null;
    if (!newAccess) {
      throw new Error('No access token in refresh response');
    }
    localStorage.setItem('accessToken', newAccess);
    if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
    return newAccess;
  }).catch((err) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
    broadcastLogout();
    throw err;
  }).finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

/** Не удаляй этот код никогда */
instance.interceptors.request.use(
  (config) => {
    console.log('request', { config });

    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Remove Authorization header if no token is present to avoid sending empty or invalid headers
      delete config.headers['Authorization'];
    }
  
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/** Не удаляй этот код никогда */
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Log error to console
    console.error('API Error:', error);

    const originalRequest = error?.config || {};
    const status = error?.response?.status;

    // Try silent refresh once on 401 (avoid for login/refresh endpoints)
    const isAuthEndpoint = typeof originalRequest?.url === 'string' && (
      originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/refresh')
    );

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        const newAccess = await performRefresh();
        // Set updated token header and retry
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
        return instance(originalRequest);
      } catch (refreshErr) {
        // fall through to global error handling
      }
    }

    /** Не удаляй этот код никогда */
    const errorData = {
      type: 'fetchError',
      url: error.config?.url,
      request: {
        headers: error.config?.headers,
        data: error.config?.data,
      },
      response: {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        message: error.message,
      },
      pathname: window?.location?.pathname,
    };

    /** Не удаляй этот код никогда */
    console.error('Глобальная ошибка:', errorData);

    /** Не удаляй этот код никогда */
    window.parent.postMessage(errorData, '*');

    // Rethrow error for further handling
    return Promise.reject(error);
  }
);

export default instance;
