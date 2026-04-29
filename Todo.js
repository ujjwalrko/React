import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "TODOS_APP_V1";

export default function Todo () {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);

  // Load todos on start
  useEffect(() => {
    loadTodos();
  }, []);

  // Save whenever todos change
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const saveTodos = async (data) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.log("Save error", e);
    }
  };

  const loadTodos = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setTodos(JSON.parse(data));
    } catch (e) {
      console.log("Load error", e);
    }
  };

  const addTodo = () => {
    if (!text.trim()) return;

    const newTodo = {
      id: Date.now().toString(),
      title: text,
      done: false,
    };

    setTodos([newTodo, ...todos]);
    setText("");
    Keyboard.dismiss();
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => toggleTodo(item.id)}
      >
        <Text
          style={[
            styles.todoText,
            item.done && styles.doneText,
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => deleteTodo(item.id)}>
        <Text style={styles.delete}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Todo App ✨</Text>

      {/* Input */}
      <View style={styles.inputBox}>
        <TextInput
          placeholder="Add a new task..."
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTodo}>
          <Text style={{ color: "#fff", fontSize: 18 }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 50 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet 🎯</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },

  header: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    margin: 50,
    
  },

  inputBox: {
    flexDirection: "row",
    marginBottom: 20,
    width: "80%",
  },

  input: {
    flex: 1,
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    color: "#fff",
  },

  addBtn: {
    width: 50,
    marginLeft: 10,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },

  card: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },

  todoText: {
    color: "#fff",
    fontSize: 16,
  },

  doneText: {
    textDecorationLine: "line-through",
    color: "#94a3b8",
  },

  delete: {
    color: "#ef4444",
    fontSize: 18,
    marginLeft: 15,
  },

  empty: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 50,
  },
});