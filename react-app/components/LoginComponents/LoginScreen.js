import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { AuthContext } from "../AuthContext/AuthContext";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isNotAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isNotAuthenticated) {
      navigation.navigate("WorkDayList");
    }
  }, [isNotAuthenticated, navigation]);

  const handleLogin = async () => {
    try {
      const response = await axios
        .post("http://localhost:3000/users/login", {
          username,
          password,
        })
        .then((response) => {
          console.log("Login request", response.data);
          if (response.data.token) {
            signIn(response.data.token, response.data.user);
            console.log("Logged in", response.data.token);
            Toast.show({
              type: "success",
              position: "bottom",
              text1: "Login Successful",
              text2: "Welcome back!",
              visibilityTime: 4000,
              autoHide: true,
            });
          }
        });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          Toast.show({
            type: "error",
            position: "bottom",
            text1: "Login Failed",
            text2: "Invalid username or password",
            visibilityTime: 4000,
            autoHide: true,
          });
        } else {
          Toast.show({
            type: "error",
            position: "bottom",
            text1: "Login Failed",
            text2: `Error: ${error.response.status} - ${error.response.statusText}`,
            visibilityTime: 4000,
            autoHide: true,
          });
        }
      } else {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Network Error",
          text2: "Unable to connect to the server. Please try again later.",
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    minWidth: 200,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 4,
    borderColor: "gray",
  },
});

export default LoginScreen;
