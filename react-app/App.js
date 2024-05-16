import React, { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Button, Text } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./components/LoginComponents/LoginScreen.js";
import RegisterScreen from "./components/LoginComponents/RegisterScreen.js";
import WorkDayList from "./components/WorkDayComponents/WorkDayList.js";
import {
  AuthProvider,
  AuthContext,
} from "./components/AuthContext/AuthContext.js";
import Toast from "react-native-toast-message";
import LogoutButton from "./components/LoginComponents/LogoutButton.js";

const Stack = createStackNavigator();

function AppStack() {
  const { user, isBoss, isLoading } = useContext(AuthContext);
  const navigation = useNavigationContainerRef();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="WorkDayList"
            component={WorkDayList}
            options={{
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  {isBoss && (
                    <Button
                      onPress={() => navigation.navigate("Register")}
                      title="Új fiók regisztrálása"
                      color="#000"
                    />
                  )}
                  <LogoutButton />
                </View>
              ),
              headerTitle: "Munkanapok",
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  <Button
                    onPress={() => navigation.navigate("WorkDayList")}
                    title="Munkanapok listája"
                    color="#000"
                  />
                  <LogoutButton />
                </View>
              ),
              title: "Új fiók regisztrálása",
            }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
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
    alignItems: "center",
    justifyContent: "center",
  },
});
