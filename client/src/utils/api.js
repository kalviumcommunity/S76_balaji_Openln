export const getBackendUrl = () => {
    return process.env.NODE_ENV === 'production' 
      ? 'https://s76-balaji-openln.onrender.com' 
      : 'http://localhost:5000';
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