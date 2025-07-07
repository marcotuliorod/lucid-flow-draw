// Utility functions to clean up auth state and prevent multiple client instances

export const cleanupAuthState = () => {
  try {
    // Remove standard auth tokens
    const keysToRemove = [
      'supabase.auth.token',
      'supabase-auth-token',
      'sb-auth-token'
    ];
    
    // Remove specific keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.includes('jfidiqskcchpkcyhjjyv')) {
        localStorage.removeItem(key);
      }
    });
    
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.includes('jfidiqskcchpkcyhjjyv')) {
        sessionStorage.removeItem(key);
      }
    });
    
    console.log('Auth state cleaned up successfully');
  } catch (error) {
    console.warn('Failed to cleanup auth state:', error);
  }
};

export const preventMultipleInstances = () => {
  // Check if another instance is already running
  const instanceKey = 'supabase-client-instance';
  const currentInstance = sessionStorage.getItem(instanceKey);
  
  if (!currentInstance) {
    // Mark this as the active instance
    sessionStorage.setItem(instanceKey, Date.now().toString());
  }
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem(instanceKey);
  });
};

// Initialize instance prevention on import
preventMultipleInstances();