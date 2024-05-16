import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBoss, setIsBoss] = useState(false);
  const [isWorker, setIsWorker] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
          setIsBoss(parsedUser.positions.includes("boss"));
          setIsWorker(parsedUser.positions.includes("worker"));
        }
      } catch (e) {
        console.error("Failed to load user", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (userData, userToken) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("token", userToken);
      setUser(userData);
      setToken(userToken);
      setIsBoss(userData.positions.includes("boss"));
      setIsWorker(userData.positions.includes("worker"));
    } catch (e) {
      console.error("Failed to save user", e);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      setUser(null);
      setToken(null);
      setIsBoss(false);
      setIsWorker(false);
    } catch (e) {
      console.error("Failed to remove user", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isBoss, isWorker, login, signOut, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
