import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Mic } from 'lucide-react-native';

function SearchBar({ value, setValue, placeholder, secureTextEntry }) {
  const handleVoiceRecognition = async () => {
    try {
      await Voice.start('en-US');
      console.log('Voice recognition started');

      Voice.onSpeechResults = (event) => {
        const speechText = event.value[0];
        console.log('Recognized speech:', speechText);

        setValue(speechText);
      };
    } catch (error) {
      console.log('Voice recognition error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry}
      />
      <TouchableOpacity onPress={handleVoiceRecognition} style={styles.voiceButton}>
        <Mic size={30} color="black" />
        {''}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
  voiceButton: {
    marginLeft: 10,
  },
});

export default SearchBar;
