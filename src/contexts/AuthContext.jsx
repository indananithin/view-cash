import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock check for existing session
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('viewCashUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (phoneOrEmail) => {
    // Mock login logic
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser = {
        uid: 'user_' + Date.now(),
        name: phoneOrEmail === '9999999999' ? 'Admin User' : 'Guest User',
        phone: phoneOrEmail,
        coins: 120,
        deviceId: localStorage.getItem('viewCashDeviceId') || generateDeviceId(),
        isAdmin: phoneOrEmail === '9999999999'
      };

      setUser(mockUser);
      localStorage.setItem('viewCashUser', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('viewCashUser');
  };

  const generateDeviceId = () => {
    const id = 'dev_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('viewCashDeviceId', id);
    return id;
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
