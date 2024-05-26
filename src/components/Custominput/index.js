import { View, TextInput, StyleSheet } from 'react-native';

const CustomInput = (props) => {
  const { value, onChangeText, placeholder, secureTextEntry, editable = true } = props;
  return (
    <View style={style.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={style.input}
        editable={editable}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '90%',
    borderColor: '#e8e8e8',
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginVertical: 6,
  },
  input: {},
});

export default CustomInput;
