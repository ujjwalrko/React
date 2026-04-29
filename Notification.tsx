import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import notifee from '@notifee/react-native';

export default function NotificationCard() {

  // 🔐 Request permission
  async function requestPermission() {
    await notifee.requestPermission();
  }

  // 🔔 Create channel (Android)
  async function createChannel() {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
    }
  }

  // 📲 Show notification
  async function showNotification() {
    await notifee.displayNotification({
      title: '🔥 Task Alert',
      body: 'This is your interactive notification',
      android: {
        channelId: 'default',
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  useEffect(() => {
    requestPermission();
    createChannel();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Center</Text>

      <TouchableOpacity style={styles.button} onPress={showNotification}>
        <Text style={styles.buttonText}>Send Notification 🚀</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#0f172a',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 15,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#38bdf8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});