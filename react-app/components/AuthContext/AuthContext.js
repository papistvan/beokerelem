import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const signIn = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    //maybesave token to secure storage
  };

  const signOut = () => {
    setUser(null);
  };

  const isNotAuthenticated = () => !!user;

  return (
    <AuthContext.Provider
      value={{ user, token, signIn, isNotAuthenticated, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
