import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Datepicker from './datepicker'
import Notification from './Notification'
import AlarmApp from './Alarm'
const App = () => {
  return (
    <View style={styles.container}>
      <Text>App</Text>
      <Datepicker/>
   
      <AlarmApp/>
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