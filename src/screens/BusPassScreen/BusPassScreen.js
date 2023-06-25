import { View, StyleSheet } from 'react-native'
import React from 'react'
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { busPassData } from '../../models/busPassData';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';
import CustomFlatList from '../../components/CustomFlatList';

const BusPassScreen = () => {

  function showItemNotSelectedToast () {
    Toast.show('Nu ati ales niciun abonament', {
      duration: Toast.durations.SHORT,
    });
  }

  return (
    <RootSiblingParent>
      <View style={styles.container}>
      <CustomFlatList 
          data={busPassData}
          isTicket={false} 
          showToast={() => showItemNotSelectedToast()}
          handleBottomButton={() => handleConfirm()}
        />
        < NavigationBar></NavigationBar>
      </View>
    </RootSiblingParent>
  )
}

export default BusPassScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '6%', 
    justifyContent: 'flex-end',
    backgroundColor: "white",
    alignItems: "center",
  },
})