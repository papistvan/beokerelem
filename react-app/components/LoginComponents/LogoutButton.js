import React, { useContext } from "react";
import { Button } from "react-native";
import { AuthContext } from "../AuthContext/AuthContext";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LogoutButton = () => {
  const { signOut } = useContext(AuthContext);

  const handleSignOut = async () => {
    await AsyncStorage.removeItem("token");
    signOut();
    Toast.show({
      type: "success",
      position: "bottom",
      text1: "Logout Successful",
      text2: "See you soon!",
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  return <Button title="Logout" onPress={handleSignOut} />;
};

export default LogoutButton;
