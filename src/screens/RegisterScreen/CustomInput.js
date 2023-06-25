import { StyleSheet, Text, View, TextInput} from 'react-native'
import React from 'react'

const CustomInput = ({value, setvalue, placeholder, secureTextEntry}) => {
  return (
    <View>
      <Text style={styles.text}>{placeholder}</Text>
      <TextInput 
        value={value}
        onChangeText={setvalue}
        placeholder={placeholder}
        style={styles.inputText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  )
}

export default CustomInput

const styles = StyleSheet.create({
  inputText: {
    backgroundColor: 'white',
    width: 300,
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,

    borderRadius: 5,
    fontSize: 13
  },

  text: {
    alignSelf: 'baseline',
    marginBottom: 3,
    fontSize: 11,
    color: 'white',
    fontWeight: '500'
  }
})