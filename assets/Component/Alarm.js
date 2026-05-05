import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import DatePicker from 'react-native-date-picker';
import notifee, { TriggerType } from '@notifee/react-native';

export default function AlarmApp() {

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('No alarm set');

  useEffect(() => {
    init();
  }, []);

  async function init() {
    await notifee.requestPermission();

    // ⚠️ IMPORTANT: new channel ID (fixes no-sound bug)
    await notifee.createChannel({
      id: 'alarm_v2',
      name: 'Alarm Channel',
      sound: 'default',
      importance: 4,
    });
  }

  async function scheduleAlarm(alarmDate) {

    let time = new Date(alarmDate);

    // if past time → next day
    if (time.getTime() <= Date.now()) {
      time.setDate(time.getDate() + 1);
    }

    await notifee.createTriggerNotification(
      {
        title: '⏰ Alarm',
        body: 'Wake up!',
        android: {
          channelId: 'alarm_v2',
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: time.getTime(),
      }
    );

    setStatus('Alarm set for ' + time.toLocaleTimeString());
  }

  function onConfirm(selectedDate) {
    if (!selectedDate) return;

    const safeDate = new Date(selectedDate);

    setOpen(false);
    setDate(safeDate);
    scheduleAlarm(safeDate);
  }

  return (
    <View style={{ padding: 20 }}>

      <Text style={{ marginBottom: 10 }}>
        {status}
      </Text>

      <Button
        title="Pick Alarm Time ⏰"
        onPress={() => setOpen(true)}
      />

      <DatePicker
        modal
        open={open}
        date={date}
        mode="time"
        onConfirm={onConfirm}
        onCancel={() => setOpen(false)}
      />

    </View>
  );
}