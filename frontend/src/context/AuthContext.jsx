import React, { createContext, useContext, useEffect, useState } from 'react';

export const isLoggedin = () => {
  const data = localStorage.getItem("data");
  return !!data;
};

export const getUser = () => {
  const data = localStorage.getItem("data");
  try {
    return data ? JSON.parse(data).user : null;
  } catch {
    return null;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isLoggedin()) {
      const userData = getUser();
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const loginContext = (loginData) => {
    localStorage.setItem("data", JSON.stringify(loginData)); // ✅ store full object
    setIsAuthenticated(true);
    setUser(loginData.user); // ✅ extract user from loginData
  };

  const logoutContext = () => {
    localStorage.removeItem("data");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
