import React, { useEffect, useContext, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../AuthContext/AuthContext.js";
import Toast from "react-native-toast-message";
import api from "../../api";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { user, isBoss } = useContext(AuthContext);

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    name: "",
    positions: "",
  });

  useEffect(() => {
    if (!isBoss) {
      navigation.navigate("WorkDayList");
    }
  }, [isBoss, navigation]);

  const handleRegister = async () => {
    try {
      const response = await api.post("/users", newUser);
      if (response.status === 201) {
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Sikeres regisztráció",
          visibilityTime: 4000,
          autoHide: true,
        });
        navigation.navigate("WorkDayList");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Hiba a regisztráció során",
        text2: error.message || "Próbáld újra",
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.card}>
        <Text style={styles.text}>Felhasználónév</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setNewUser({ ...newUser, username: text })}
        />
        <Text style={styles.text}>Jelszó</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          onChangeText={(text) => setNewUser({ ...newUser, password: text })}
        />
        <Text style={styles.text}>Név</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setNewUser({ ...newUser, name: text })}
        />
        <Text style={styles.text}>Beosztás</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setNewUser({ ...newUser, positions: text })}
        />
        <Button title="Regisztráció" onPress={handleRegister} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "80%",
    minWidth: 300,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  text: {
    fontSize: 20,
    height: 50,
    padding: 10,
    width: "100%",
    marginVertical: 10,
  },
});
