import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
  Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import DatePicker from "react-native-date-picker";
import notifee, { TriggerType } from "@notifee/react-native";

const STORAGE_KEY = "TODOS_APP_V1";

const CARD_COLORS = ["#FF90E8", "#FFC900", "#22C55E", "#00E5FF"];

export default function Todo() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  
  // Alarm states for new task
  const [alarmDate, setAlarmDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [hasAlarm, setHasAlarm] = useState(false);

  // Load todos on start
  useEffect(() => {
    loadTodos();
    initNotifications();
  }, []);

  // Save whenever todos change
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const initNotifications = async () => {
    await notifee.requestPermission();
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'alarm_v2',
        name: 'Alarm Channel',
        sound: 'default',
        importance: 4,
      });
    }
  };

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

  const scheduleAlarm = async (taskTitle, dateObj) => {
    let time = new Date(dateObj);
    if (time.getTime() <= Date.now()) {
      time.setDate(time.getDate() + 1); // Set for tomorrow if time has passed today
    }
    
    const notificationId = Date.now().toString() + "_alarm";
    
    await notifee.createTriggerNotification(
      {
        id: notificationId,
        title: '⏰ Task Reminder',
        body: `Time to do: `+{taskTitle},
        android: {
          channelId: 'alarm_v2',
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: time.getTime(),
      }
    );
    return notificationId;
  };

  const cancelAlarm = async (notificationId) => {
    if (notificationId) {
      await notifee.cancelNotification(notificationId);
    }
  };

  const addTodo = async () => {
    if (!text.trim()) return;

    let notificationId = null;
    let finalAlarmDate = null;

    if (hasAlarm) {
      notificationId = await scheduleAlarm(text, alarmDate);
      finalAlarmDate = alarmDate.toISOString();
    }

    const newTodo = {
      id: Date.now().toString(),
      title: text,
      done: false,
      notificationId: notificationId,
      alarmDate: finalAlarmDate,
      color: CARD_COLORS[todos.length % CARD_COLORS.length]
    };

    setTodos([newTodo, ...todos]);
    setText("");
    setHasAlarm(false);
    Keyboard.dismiss();
  };

  const deleteTodo = (id) => {
    const todoToDelete = todos.find((t) => t.id === id);
    if (todoToDelete?.notificationId) {
      cancelAlarm(todoToDelete.notificationId);
    }
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
    <View style={styles.cardContainer}>
      <View style={styles.cardShadow} />
      <View style={[styles.card, { backgroundColor: item.color || "#FFF" }]}>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
          onPress={() => toggleTodo(item.id)}
        >
          <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
            {item.done && <Icon name="checkmark" size={18} color="#FFF" />}
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text
              style={[
                styles.todoText,
                item.done && styles.doneText,
              ]}
            >
              {item.title}
            </Text>
            {item.alarmDate && !item.done && (
              <View style={styles.alarmBadge}>
                <Icon name="alarm-outline" size={12} color="#000" />
                <Text style={styles.alarmText}>
                  {new Date(item.alarmDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteTodo(item.id)}>
          <Icon name="trash-outline" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>TARGETS</Text>

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputShadow} />
        <View style={styles.inputBox}>
          <TextInput
            placeholder="What needs to be done?"
            placeholderTextColor="#666"
            value={text}
            onChangeText={setText}
            style={styles.input}
          />
          <TouchableOpacity 
            style={[styles.bellBtn, hasAlarm && styles.bellBtnActive]} 
            onPress={() => setIsDatePickerOpen(true)}
          >
            <Icon name={hasAlarm ? "notifications" : "notifications-outline"} size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={addTodo}>
            <Icon name="add" size={26} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {hasAlarm && (
        <Text style={styles.alarmIndicatorText}>
          Alarm set for: {alarmDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </Text>
      )}

      {/* List */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 20, paddingTop: 10 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyShadow} />
            <View style={styles.emptyBox}>
              <Text style={styles.empty}>Nothing to do. Add a target! 🎯</Text>
            </View>
          </View>
        }
      />

      <DatePicker
        modal
        open={isDatePickerOpen}
        date={alarmDate}
        mode="time"
        onConfirm={(selectedDate) => {
          setIsDatePickerOpen(false);
          setAlarmDate(selectedDate);
          setHasAlarm(true);
        }}
        onCancel={() => setIsDatePickerOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F0EA",
    width: '100%',
  },
  header: {
    textAlign: "center",
    fontSize: 42,
    fontWeight: "900",
    color: "#000",
    marginTop: 60,
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 2,
    textShadowColor: '#FFF',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  inputContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
    position: 'relative',
  },
  inputShadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    backgroundColor: '#000',
    borderRadius: 0,
  },
  inputBox: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderWidth: 3,
    borderColor: "#000",
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    padding: 10,
    color: "#000",
    fontSize: 16,
    fontWeight: 'bold',
  },
  bellBtn: {
    padding: 10,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 8,
  },
  bellBtnActive: {
    backgroundColor: '#FFC900',
    borderColor: '#000',
  },
  addBtn: {
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
    borderWidth: 3,
    borderColor: "#000",
  },
  alarmIndicatorText: {
    marginLeft: 25,
    marginBottom: 20,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E11D48',
  },
  cardContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  cardShadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    backgroundColor: '#000',
  },
  card: {
    borderWidth: 3,
    borderColor: '#000',
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: {
    backgroundColor: '#000',
  },
  todoText: {
    color: "#000",
    fontSize: 18,
    fontWeight: 'bold',
  },
  doneText: {
    textDecorationLine: "line-through",
    color: "#666",
  },
  alarmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#000',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 6,
  },
  alarmText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    color: '#000',
  },
  deleteBtn: {
    backgroundColor: "#EF4444",
    width: 44,
    height: 44,
    borderWidth: 3,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
  emptyContainer: {
    marginTop: 40,
    position: 'relative',
    alignSelf: 'center',
  },
  emptyShadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    backgroundColor: '#000',
  },
  emptyBox: {
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderColor: '#000',
    padding: 20,
  },
  empty: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});