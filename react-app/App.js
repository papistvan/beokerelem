import React, { useContext, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, Button } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./components/LoginComponents/LoginScreen.js";
import RegisterScreen from "./components/LoginComponents/RegisterScreen.js";
import WorkDayList from "./components/WorkDayComponents/WorkDayList.js";
import ScheduleList from "./components/ScheduleComponents/ScheduleList.js";
import {
  AuthProvider,
  AuthContext,
} from "./components/AuthContext/AuthContext";
import Toast from "react-native-toast-message";
import LogoutButton from "./components/LoginComponents/LogoutButton.js";

const Stack = createStackNavigator();

function AppStack({ navigationRef }) {
  const { user, isBoss, isLoading } = useContext(AuthContext);

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
            options={{
              headerRight: () => (
                <View style={styles.headerButtons}>
                  {isBoss && (
                    <Button
                      onPress={() =>
                        navigationRef.current?.navigate("Register")
                      }
                      title="Új fiók regisztrálása"
                      color="#000"
                    />
                  )}
                  <Button
                    onPress={() =>
                      navigationRef.current?.navigate("ScheduleList")
                    }
                    title="Beosztás"
                    color="#000"
                  />
                  <LogoutButton />
                </View>
              ),
              headerTitle: "Munkanapok",
            }}
          >
            {(props) => (
              <WorkDayList {...props} navigationRef={navigationRef} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="ScheduleList"
            options={{
              headerRight: () => (
                <View style={styles.headerButtons}>
                  {isBoss && (
                    <Button
                      onPress={() =>
                        navigationRef.current?.navigate("Register")
                      }
                      title="Új fiók regisztrálása"
                      color="#000"
                    />
                  )}
                  <Button
                    onPress={() =>
                      navigationRef.current?.navigate("WorkDayList")
                    }
                    title="Munkanapok listája"
                    color="#000"
                  />
                  <LogoutButton />
                </View>
              ),
              headerTitle: "Beosztás",
            }}
          >
            {(props) => (
              <ScheduleList {...props} navigationRef={navigationRef} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Register"
            options={{
              headerRight: () => (
                <View style={styles.headerButtons}>
                  <Button
                    onPress={() =>
                      navigationRef.current?.navigate("WorkDayList")
                    }
                    title="Munkanapok listája"
                    color="#000"
                  />
                  <LogoutButton />
                </View>
              ),
              headerTitle: "Új fiók regisztrálása",
            }}
          >
            {(props) => (
              <RegisterScreen {...props} navigationRef={navigationRef} />
            )}
          </Stack.Screen>
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
        <AppStack navigationRef={navigationRef} />
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
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
});
