import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const signIn = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
  };

  const isNotAuthenticated = () => !user;

  const isBoss = () => user && user.positions.includes("boss");

  return (
    <AuthContext.Provider
      value={{ user, token, signIn, isNotAuthenticated, signOut, isBoss }}
    >
      {children}
    </AuthContext.Provider>
  );
};
