import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./components/LoginComponents/LoginScreen.js";
import { AuthProvider } from "./components/AuthContext/AuthContext.js";
import Toast from "react-native-toast-message";
import { Platform } from "react-native";
import { useEffect } from "react";

export default function App() {
  return (
    <>
      <AuthProvider>
        <View style={styles.container}>
          <LoginScreen />
          <StatusBar style="auto" />
          <Toast />
        </View>
      </AuthProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
