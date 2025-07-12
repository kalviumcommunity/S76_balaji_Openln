export const getBackendUrl = () => {
  // Use environment variable with fallback to localhost for development
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
};
  
export const apiRequest = async (endpoint, options = {}) => {
  const backendUrl = getBackendUrl();
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    credentials: 'include'
  };
  
  try {
    const response = await fetch(
      `${backendUrl}${endpoint}`, 
      { ...defaultOptions, ...options }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};