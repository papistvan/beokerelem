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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../AuthContext/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import api from "../../api";

export default function WorkDayList() {
  const navigation = useNavigation();
  const { isNotAuthenticated, isBoss } = useContext(AuthContext);

  const [workdays, setWorkdays] = useState([]);

  useEffect(() => {
    fetchWorkDays();
  }, []);

  const fetchWorkDays = async () => {
    const date = new Date().toISOString().slice(0, 10);
    try {
      const response = await api.get(`/workdays/${date}`);
      setWorkdays(response.data);
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Failed to load workdays",
        text2: error.message || "Check your connection",
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  const handleDeleteWorkday = async (date) => {
    try {
      await api.delete(`/workdays/day/${date}`);
      fetchWorkDays();
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Munkanap törölve",
        visibilityTime: 4000,
        autoHide: true,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Hiba a munkanap törlésekor",
        text2: error.response?.data?.error || error.message,
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, item.feast && styles.feast]}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.text}>Nyitva: {item.openhour}</Text>
      <Text style={styles.text}>Zárás: {item.closehour}</Text>
      <View style={styles.buttonContainer}>
        <FontAwesome.Button
          name="edit"
          backgroundColor="#3b5998"
          onPress={() => console.log(`Edit ${item.date}`)}
        />
        <FontAwesome.Button
          name="trash"
          backgroundColor="#d9534f"
          onPress={() => handleDeleteWorkday(item.date)}
        />
      </View>
    </View>
  );

  const AddWorkday = ({ onAdd }) => {
    const [date, setDate] = useState("");
    const [openHour, setOpenHour] = useState("");
    const [closeHour, setCloseHour] = useState("");
    const [manHour, setManHour] = useState("");
    const [feast, setFeast] = useState(false);

    return (
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="Dátum (YYYY-MM-DD)"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={openHour}
          onChangeText={setOpenHour}
          placeholder="Nyitás óra"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={closeHour}
          onChangeText={setCloseHour}
          placeholder="Zárás óra"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={manHour}
          onChangeText={setManHour}
          placeholder="Elérhető munkaóra"
          keyboardType="numeric"
        />
        <View style={styles.switchContainer}>
          <Text>Feast</Text>
          <Switch value={feast} onValueChange={setFeast} />
        </View>
        <Button
          title="Hozzáadás"
          onPress={() => onAdd({ date, openHour, closeHour, manHour, feast })}
        />
      </View>
    );
  };

  const handleAddWorkday = async (workday) => {
    try {
      const response = await api.post("/workdays/day", {
        date: workday.date,
        openhour: Number(workday.openHour),
        closehour: Number(workday.closeHour),
        manhour: Number(workday.manHour),
        feast: workday.feast,
      });

      if (response.status === 200) {
        fetchWorkDays();
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Munkanap hozzáadva",
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Hiba a munkanap hozzáadásakor",
        text2: error.response?.data?.error || error.message,
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text>
        Elérhető munkanapok
        <FontAwesome.Button name="refresh" onPress={fetchWorkDays}>
          Frissítés
        </FontAwesome.Button>
      </Text>
      {isBoss && <AddWorkday onAdd={handleAddWorkday} />}
      <FlatList
        data={workdays}
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
        horizontal={true}
        pagingEnabled={true}
      />
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
    fontSize: 25,
    fontWeight: "bold",
  },
});
