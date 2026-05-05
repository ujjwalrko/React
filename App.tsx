import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Datepicker from './datepicker'
import AlarmApp from './assets/Component/Alarm'
import AsyncStorageTest from './assets/Component/Async'
import Todo from './assets/Component/Todo'
const App = () => {
  return (
    <View style={styles.container}>

      <Todo />

    </View>
  )
}

export default App

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0095ff'
  }

})