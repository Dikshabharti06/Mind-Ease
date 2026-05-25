
// Auth utility functions

/**
 * Get authentication token from localStorage
 */
export const getToken = (): string | null => {
  try {
    const token = localStorage.getItem('token');
    console.log('getToken called, token exists:', !!token);
    if (token) {
      console.log('Token first 10 chars:', token.substring(0, 10) + '...');
    }
    return token;
  } catch (error) {
    console.error('Error retrieving token from localStorage:', error);
    return null;
  }
};

/**
 * Set authentication token in localStorage
 */
export const setToken = (token: string): void => {
  try {
    console.log('Setting token in localStorage:', token.substring(0, 10) + '...');
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('Error setting token in localStorage:', error);
  }
};

/**
 * Remove authentication token from localStorage
 */
export const removeToken = (): void => {
  try {
    console.log('Removing token from localStorage');
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Error removing token from localStorage:', error);
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  try {
    const isAuth = !!getToken();
    console.log('isAuthenticated check result:', isAuth);
    return isAuth;
  } catch (error) {
    console.error('Error in isAuthenticated check:', error);
    return false;
  }
};

/**
 * Get token with proper format for API requests
 * Includes both Authorization header with Bearer format AND x-auth-token format
 */
export const getAuthHeader = (): { [key: string]: string } => {
  try {
    const token = getToken();
    let headers = {};
    
    if (token) {
      headers = { 
        'Authorization': `Bearer ${token}`, 
        'x-auth-token': token 
      };
      console.log('Auth headers generated:', Object.keys(headers));
    } else {
      console.warn('No token available for headers');
    }
    
    return headers;
  } catch (error) {
    console.error('Error generating auth headers:', error);
    return {};
  }
};
