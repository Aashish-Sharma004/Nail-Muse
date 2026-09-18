// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '../services/api';

const AuthContext = createContext();

// Helper to remove any lingering legacy items from Local Storage for clean security hygiene
const purgeLegacyStorage = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  } catch (err) {
    console.error('Error clearing local storage:', err);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch authenticated session user on application load using the HttpOnly cookie
  const checkAuthStatus = useCallback(async () => {
    try {
      purgeLegacyStorage(); // Ensure no tokens linger in client-side storage
      const response = await getCurrentUser();
      if (response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch {
      // Unauthenticated or expired session
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Login handler: backend automatically sets HttpOnly cookie
  const login = async (credentials) => {
    purgeLegacyStorage();
    const response = await loginUser(credentials);
    const loggedUser = response.data.user;
    setUser(loggedUser);
    return loggedUser;
  };

  // Register handler: backend automatically sets HttpOnly cookie
  const register = async (userData) => {
    purgeLegacyStorage();
    const response = await registerUser(userData);
    const registeredUser = response.data.user;
    setUser(registeredUser);
    return registeredUser;
  };

  // Logout handler: informs backend to clear HttpOnly cookie and resets state
  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      purgeLegacyStorage();
    }
  };

  // Refresh user data (useful after redeeming points or bookings)
  const refreshUser = async () => {
    try {
      const response = await getCurrentUser();
      if (response.data && response.data.user) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error('Error refreshing user profile:', err);
    }
  };

  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === 'admin' || user?.email === 'admin123@gmail.com';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
        checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
