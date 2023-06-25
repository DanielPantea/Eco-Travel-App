import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { useNavigation } from '@react-navigation/core'
import { RootSiblingParent } from 'react-native-root-siblings';
import { SelectList } from 'react-native-dropdown-select-list';
import CustomView from './CustomView';
import Toast from 'react-native-root-toast';
import { child, ref, push, update } from '@firebase/database'
import { database, auth } from '../../../firebase';

const data = [
  {key: '1', value:"student"},
  {key: '2', value:"pensionar"}
];

const ConfirmStudentPassScreen = ({}) => {

  const navigation = useNavigation()
  const [selectedValue, setSelectedValue] = useState("")
  const [identityCard, setIdentityCard] = useState(null)
  const [transporCard, setTransportCard] = useState(null)
  const [studentCard, setStudentCard] = useState(null)
  const [isUploaded, setIsUploaded] = useState(false)

  const userId = auth.currentUser?.uid

  useEffect(() => {
    if(selectedValue === 'student' && identityCard && studentCard && transporCard){
      setIsUploaded(true)
    } else if (selectedValue === 'pensionar' && identityCard){
      setIsUploaded(true)
    }
  }, [identityCard, studentCard, transporCard])
  
  useEffect(() => {
    setIdentityCard(null);
    setTransportCard(null);
    setStudentCard(null);
    setIsUploaded(false)
  }, [selectedValue])
  
  

  function getDropdownSelectedDetails () {
    if(selectedValue === 'student') {
      return(
        <View style={{flex:1, margin: 10}}>
            <Text style={styles.text}>
              Act de identitate:
            </Text>
            <CustomView getImage={setIdentityCard}/>
            <Text style={styles.text}>
              Legitimatie de transport
            </Text>
            <CustomView getImage={setTransportCard}/>
            <Text style={styles.text}>
              Carnet de student:
            </Text>
            <CustomView getImage={setStudentCard}/>
        </View>
      )
    } else if (selectedValue === 'pensionar') {
      return(
        <View style={{flex:1, margin: 10}}>
          <Text style={styles.text}>
              Act de identitate:
            </Text>
          <CustomView getImage={setIdentityCard}/>
        </View>
      )
    }
  }

  function showNotUploadedToast () {
    Toast.show('Nu ati incarcat toate documentele', {
      duration: Toast.durations.LONG,
    });
  }

  function writeSubscriptionToDB(){
    const date = new Date();

    const postData = {
        date: date,
        type: 'student',
        state: 'In asteptare',
    };
    const newPostKey = push(child(ref(database),'posts')).key;

    const updates = {}
    updates['users/' + userId + '/subscriptions/' + newPostKey] = postData;

    update(ref(database), updates)
    showNotUploadedToast()
  }

  function showUploadedToast () {
    Toast.show('Ati incarcat cu succes', {
      duration: Toast.durations.LONG,
    });
  }

  return (
    <RootSiblingParent>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <SelectList
            setSelected={(val) => setSelectedValue(val)}
            data={data}
            save="value"
            search={false}
            boxStyles={styles.selectList}
            dropdownStyles={{}}
          />
          {getDropdownSelectedDetails()}
        </View>
        <TouchableOpacity
          onPress={() => Linking.openURL("http://ratt.ro/taxare/facilitati.pdf")}
          >
          <Text 
            style={{fontWeight: 'bold', fontSize: 15, textDecorationLine: 'underline'}}
          >
            Vezi ce facilitati ai
          </Text>
        </TouchableOpacity>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={[styles.buttons]} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={23} color="white" />
            <Text style={{fontSize: 20, color: 'white', fontWeight:"500"}}>Inapoi   </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.buttons}
            onPress={isUploaded? () => writeSubscriptionToDB() : () => showNotUploadedToast()} 
          >
            <Text style={{fontSize: 20, color: 'white', fontWeight:"500"}}>  Incarca</Text>
            <Ionicons name="chevron-forward" size={23} color="white"/>
          </TouchableOpacity>  
        </View>
        <NavigationBar></NavigationBar>
      </View>
    </RootSiblingParent>
  )
}

export default ConfirmStudentPassScreen

const styles = StyleSheet.create({

  container: {
    flex: 1,
    marginTop: '6%',
    justifyContent: 'flex-end',
    backgroundColor: "white",
    alignItems: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    marginVertical: 20,
  },

  buttons: {
    flexDirection: "row",
    backgroundColor: "#279032",
    padding: 10,
    marginHorizontal: 20,
    width: 130,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  topContainer: {
    margin: 30,
    padding: 15,
    flex: 1,
    width: '85%',
    flexDirection: 'column',
    backgroundColor: '#F1EBEB',
    borderRadius: 10,
  },

  text: {
    fontSize: 20,
    fontWeight: '500',
  }, 
})