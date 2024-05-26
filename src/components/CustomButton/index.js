import { Text, StyleSheet, Pressable } from 'react-native';

const CustomButton = (props) => {
  const { onPress, text } = props;
  return (
    <Pressable onPress={onPress} style={style.container}>
      <Text style={style.text}>{text}</Text>
    </Pressable>
  );
};

const style = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
    backgroundColor: 'red',
    width: '90%',
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
  },
});

export default CustomButton;
