import React, { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./components/LoginComponents/LoginScreen";
import WorkDayList from "./components/WorkDayComponents/WorkDayList";
import {
  AuthProvider,
  AuthContext,
} from "./components/AuthContext/AuthContext";
import Toast from "react-native-toast-message";
import LogoutButton from "./components/LoginComponents/LogoutButton";

const Stack = createStackNavigator();

function AppStack() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen
          name="WorkDayList"
          component={WorkDayList}
          options={{
            headerRight: () => <LogoutButton />,
          }}
        />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const navigationRef = useNavigationContainerRef();

  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <AppStack />
        <StatusBar style="auto" />
        <Toast />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
