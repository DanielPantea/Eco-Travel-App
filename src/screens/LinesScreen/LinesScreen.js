import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import NavigationBar from '../../components/NavigationBar/NavigationBar';


const LinesScreen = () => {
  return (
    <View style={styles.container}> 
      <Text>LinesScreen</Text>
      < NavigationBar></NavigationBar>
    </View>
  )
}

export default LinesScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '6%', 
    justifyContent: 'flex-end'
  },
})