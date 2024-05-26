import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet } from 'react-native';

import Background from '../../assets/images/Background.jpeg';
import CustomButton from '../../components/CustomButton';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const CountinuePressed = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <Image source={Background} style={styles.backgroundImage} />
      <Text style={styles.heading}> Welcome to PartPicker</Text>
      <Text style={styles.subHeading}> Your Personal Spare Part Locator</Text>
      <CustomButton text="Countinue" onPress={CountinuePressed} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heading: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});

export default WelcomeScreen;
