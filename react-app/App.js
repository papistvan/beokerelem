import { useContext, React } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./components/LoginComponents/LoginScreen.js";
import WorkDayList from "./components/WorkDayComponents/WorkDayList.js";
import {
  AuthProvider,
  AuthContext,
} from "./components/AuthContext/AuthContext.js";
import Toast from "react-native-toast-message";
import LogoutButton from "./components/LoginComponents/LogoutButton.js";

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

  const handleNavigation = (name) => {
    if (navigationRef.isReady()) {
      navigationRef.navigate(name);
    }
  };

  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <AppStack />
        <StatusBar style="auto" />
        <Toast /> {/* ref={(ref) => Toast.setRef(ref)}  */}
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
