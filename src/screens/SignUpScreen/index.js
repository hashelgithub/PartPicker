import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Custominput from '../../components/Custominput';
import CustomButton from '../../components/CustomButton';
import Picture from '../../assets/images/Picture.jpg';

const SignUpScreen = () => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigation = useNavigation();

  const onRegisterPressed = async (data) => {
    console.log('Form Submitted: ', data);
    try {
      if (!data?.email || !data?.password) {
        throw new Error('Please fill in all fields.');
      }
      await auth().createUserWithEmailAndPassword(data?.email, data?.password);
      console.log('User Registered');
      const user = {
        email: data?.email,
        isVendor: data?.isVendor,
      };
      await firestore().collection('users').add(user);
      console.log('User Object Saved in DB');
      Toast.show({
        type: 'success',
        text1: 'Successfully Registered.',
      });
      navigation.navigate('SignIn');
      reset();
    } catch (err) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: `${err?.message?.replace(/\[.*?\]/g, '').trim()}`,
      });
    }
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <Image source={Picture} style={style.picture} />
        <Text style={style.heading}>Register</Text>
        <Text style={style.subHeading}>Create an account</Text>
        <View style={style.container}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Custominput
                placeholder="Email"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            name="email"
            defaultValue=""
          />
          {errors.email && <Text style={style.errorText}>{errors.email.message}</Text>}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Custominput
                placeholder="Password"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                secureTextEntry
              />
            )}
            name="password"
            defaultValue=""
          />
          {errors.password && <Text style={style.errorText}>{errors.password.message}</Text>}

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={style.checkboxContainer}>
                <TouchableOpacity style={style.checkbox} onPress={() => onChange(!value)}>
                  <View
                    style={
                      !value ? [(style.checkboxInner, style.checkboxChecked)] : style.checkboxInner
                    }
                  />
                </TouchableOpacity>
                <Text style={style.checkboxText}>Vendor</Text>
              </View>
            )}
            name="isVendor"
            defaultValue={false}
          />

          <CustomButton text="Register" onPress={handleSubmit(onRegisterPressed)} />
        </View>
        <Text style={style.terms}>
          By registering, you confirm that you accept our
          <Text style={style.link}> Terms of Use</Text> and
          <Text style={style.link}> Privacy Policy</Text>
        </Text>

        <Pressable onPress={() => onSignInPress()} style={style.createAccountContainer}>
          <Text style={style.createAccount}>Have an account? </Text>
          <Text style={[style.createAccount, style.createAccountBtn]}>Login In</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  picture: {
    width: 450,
    height: 150,
  },
  heading: {
    fontSize: 44,
    textAlign: 'center',
    fontWeight: '700',
    color: 'black',
  },
  subHeading: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  terms: {
    color: 'gray',
    marginVertical: 6,
    paddingHorizontal: 20,
    fontSize: 14,
  },
  link: {
    color: '#FDB075',
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  createAccountContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  createAccount: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 6,
  },
  createAccountBtn: {
    color: 'red',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: 'blue',
  },
  checkboxChecked: {
    backgroundColor: 'blue',
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default SignUpScreen;
