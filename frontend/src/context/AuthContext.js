import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // You might want to store user details here

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Optionally, fetch user details here if your backend provides a /me endpoint
      // axios.get('/api/me', { headers: { Authorization: `Bearer ${token}` } })
      //   .then(response => setUser(response.data))
      //   .catch(() => {
      //     setToken(null);
      //     localStorage.removeItem('token');
      //   });
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, { email, password });
      setToken(response.data.token);
      // setUser(response.data.user); // Assuming your login response includes user data
      return true;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      setToken(null);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
