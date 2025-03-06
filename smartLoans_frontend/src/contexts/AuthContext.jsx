// src/Home/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";
import { toast } from 'react-toastify';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [role, setRole] = useState(JSON.parse(sessionStorage.getItem("role")) || null);
 

  const checkTokenExpiration = () => {
    const currentToken = sessionStorage.getItem("token");
    if (currentToken) {
      try {
        const payload = JSON.parse(atob(currentToken.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        
        console.log('Current time:', new Date(currentTime).toISOString());
        console.log('Expiration time:', new Date(expirationTime).toISOString());
        console.log('Time until expiration:', (expirationTime - currentTime) / 1000, 'seconds');

        if (currentTime >= expirationTime) {
          console.log('Token expired, logging out...');
          logout();
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error checking token expiration:", error);
        logout();
        return false;
      }
    }
    return false;
  };

  // Check token expiration more frequently (every 10 seconds)
  useEffect(() => {
    if (token) {
      // Initial check
      checkTokenExpiration();

      // Set up periodic checks
      const intervalId = setInterval(() => {
        checkTokenExpiration();
      }, 100000); // Check every 10 seconds

      return () => clearInterval(intervalId);
    }
  }, [token]);

  // Set up axios interceptors
  useEffect(() => {
    // Request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        if (token && !checkTokenExpiration()) {
          throw new axios.Cancel('Token expired');
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.log('Received 401 response, logging out...');
          logout();
          window.location.href='/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  // src/Home/contexts/AuthContext.jsx
const login = async (newToken) => {
  try {
    sessionStorage.setItem("token", newToken);
    setToken(newToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    
    const response = await AuthService.getCurrentUser();
    if (response && response.claims) {
      const userInfo = response.claims;
      console.log("UserInfo",userInfo)
      setUser(userInfo);
      setRole(response.claims.roles[0]);
      sessionStorage.setItem("role", JSON.stringify(response.claims.roles[0]));
      sessionStorage.setItem("user", JSON.stringify(userInfo));
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    setUser(null);
  }
};


  const logout = () => {
    console.log('Logging out...');
    sessionStorage.clear();
    setToken(null);
    setUser(null);
    setRole(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      login, 
      logout, 
      role, 
      setUser,
      setToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
