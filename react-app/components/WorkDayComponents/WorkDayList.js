import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../AuthContext/AuthContext";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>WorkDaylist</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
