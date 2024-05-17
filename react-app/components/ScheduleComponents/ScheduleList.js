import React, { useEffect, useContext, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Switch,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import { AuthContext } from "../AuthContext/AuthContext.js";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import api from "../../api";

export default function ScheduleList({ navigation }) {
  const { user, isBoss, isWorker } = useContext(AuthContext);

  const [scheduleDays, setScheduleDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScheduleDays();
  }, []);

  const fetchScheduleDays = async () => {
    const date = new Date().toISOString().slice(0, 10);
    try {
      const response = await api.get(`/schedules/${date}`);
      const scheduleData = response.data;
      const scheduleWithWorkdays = [];

      await Promise.all(
        scheduleData.map(async (day) => {
          const workdayResponse = await api.get(`/workdays/day/${day.date}`);
          let applications = [];
          let isAccepted = false;
          if (isBoss) {
            const applicationsResponse = await api.get(
              `/schedules/applications/${day.date}`
            );
            applications = applicationsResponse.data;
          } else if (isWorker) {
            const isAcceptedResponse = await api.get(
              `/schedules/applications/${day.date}/${user.username}`
            );
            isAccepted = isAcceptedResponse.data.accepted;
          }

          scheduleWithWorkdays.push({
            date: day.date,
            openhour: workdayResponse.data.openhour,
            closehour: workdayResponse.data.closehour,
            manhour: workdayResponse.data.manhour,
            feast: workdayResponse.data.feast,
            applications: applications,
            isAccepted: isAccepted,
          });
        })
      );

      setScheduleDays(scheduleWithWorkdays);
      setLoading(false);
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Failed to load schedule days",
        text2: error.message || "Check your connection",
        visibilityTime: 4000,
        autoHide: true,
      });
      setLoading(false);
    }
  };

  const acceptApplication = async (date, username) => {
    try {
      await api.post(`/schedules/accept/${date}/${username}`);
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Elfogadtad a jelentkezést",
        text2: `${username}, ${date} elfogadva`,
        visibilityTime: 4000,
        autoHide: true,
      });
      fetchScheduleDays();
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Failed to accept application",
        text2: error.message || "Check your connection",
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  const renderItem = ({ item }) => {
    if (isWorker && item.isAccepted) {
      return (
        <View style={styles.card}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.text}>Open: {item.openhour}</Text>
          <Text style={styles.text}>Close: {item.closehour}</Text>
          <Text style={styles.text}>Várunk a munkára</Text>
        </View>
      );
    } else if (isBoss) {
      return (
        <View style={[styles.card, item.feast && styles.feast]}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.text}>Open: {item.openhour}</Text>
          <Text style={styles.text}>Close: {item.closehour}</Text>

          {isBoss && (
            <>
              <Text style={styles.text}>Jelentkezők:</Text>
              {item.applications.map((app, index) => (
                <View key={index} style={styles.application}>
                  <Text>{app.username}</Text>
                  <Button
                    disabled={app.accepted != 1 ? false : true}
                    title="Elfogad"
                    onPress={() => acceptApplication(item.date, app.username)}
                  />
                </View>
              ))}
            </>
          )}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>
        Elérhető beosztások{"  "}
        <FontAwesome.Button name="refresh" onPress={fetchScheduleDays}>
          Frissítés
        </FontAwesome.Button>
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={scheduleDays}
          renderItem={renderItem}
          keyExtractor={(item) => item.date}
          horizontal={false}
          pagingEnabled={false}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 10,
  },
  card: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    padding: 15,
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
    fontSize: 18,
    height: 40,
    padding: 5,
    width: "100%",
    marginVertical: 5,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  feast: {
    borderColor: "red",
  },
  date: {
    fontSize: 22,
    fontWeight: "bold",
  },
  h1: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 10,
    textAlign: "center",
  },
  application: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 5,
  },
});
