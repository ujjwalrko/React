import React, { useState } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "test_key";

export default function AsyncStorageTest() {
  const [input, setInput] = useState("");
  const [storedValue, setStoredValue] = useState("");

  // Save data
  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, input);
      Alert.alert("Success", "Data saved!");
      setInput("");
    } catch (e) {
      Alert.alert("Error", "Failed to save data");
      console.log(e);
    }
  };

  // Get data
  const loadData = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null) {
        setStoredValue(value);
      } else {
        setStoredValue("No data found");
      }
    } catch (e) {
      Alert.alert("Error", "Failed to load data");
      console.log(e);
    }
  };

  // Remove data
  const clearData = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setStoredValue("");
      Alert.alert("Cleared", "Data removed");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        AsyncStorage Test
      </Text>

      <TextInput
        placeholder="Enter value"
        value={input}
        onChangeText={setInput}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />

      <Button title="Save Data" onPress={saveData} />
      <View style={{ marginTop: 10 }} />

      <Button title="Load Data" onPress={loadData} />
      <View style={{ marginTop: 10 }} />

      <Button title="Clear Data" onPress={clearData} />

      <Text style={{ marginTop: 20, fontSize: 16 }}>
        Stored Value: {storedValue}
      </Text>
    </View>
  );
}