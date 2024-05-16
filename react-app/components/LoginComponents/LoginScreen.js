import React, { useContext, useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../AuthContext/AuthContext.js";
import Toast from "react-native-toast-message";
import api from "../../api.js";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await api.post("/users/login", { username, password });
      if (response.status === 200) {
        login(response.data.user, response.data.token);
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Sikeres bejelentkezés",
          visibilityTime: 4000,
          autoHide: true,
        });
        navigation.navigate("WorkDayList");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Hiba a bejelentkezés során",
        text2: error.message || "Próbáld újra",
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bejelentkezés</Text>
      <TextInput
        style={styles.input}
        placeholder="Felhasználónév"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Jelszó"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Bejelentkezés" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
});
