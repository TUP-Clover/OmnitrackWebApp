import React, { createContext, useState, useEffect } from "react";

// Create context
export const UserContext = createContext();

// Provide context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for user data (if stored there during login)
    const storedUser = {
      userId: localStorage.getItem("userId"),
      username: localStorage.getItem("username"),
      email: localStorage.getItem("email"),
      isNewUser: localStorage.getItem("isNewUser") === 'true',
    };

    if (storedUser.userId) {
      setUser(storedUser);
    }
    setLoading(false)
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    // Optionally, persist user in localStorage
    localStorage.setItem("userId", userData.userId);
    localStorage.setItem("username", userData.username);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("isNewUser", userData.isNewUser);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.clear(); // Clear localStorage on logout
  };

  return (
    <UserContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
