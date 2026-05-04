import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Datepicker from './datepicker'
import Notification from './Notification'
import AlarmApp from './Alarm'
import AsyncStorageTest from './Async'
import Todo from './Todo'
const App = () => {
  return (
    <View style={styles.container}>
      
      <Todo/>
      
    </View>
  )
}

export default App

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:'#0095ff',
    alignItems:'center',
    justifyContent:'center'
  }

})