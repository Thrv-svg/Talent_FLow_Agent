import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('talentflow_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
    (error) => {
      // Only 401 Unauthorized means the token is invalid/expired
      if (error.response && (error.response.status === 401)) {
        // Prevent redirecting if the 401 came from the login route (invalid credentials)
        if (error.config && error.config.url && error.config.url.includes('/api/login')) {
          return Promise.reject(error);
        }

        // Clear token and redirect to login for protected routes
        localStorage.removeItem('talentflow_token');
        localStorage.removeItem('talentflow_user');
        localStorage.removeItem('talentflow_user_profile');
        window.location.reload(); // Reload will naturally take the user to the login state since token is removed
        
        return new Promise(() => {}); // Prevent execution of catch blocks
      }
      return Promise.reject(error);
    }
);

export default apiClient;
