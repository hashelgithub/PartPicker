import { View, Text, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Picture from '../../assets/images/Picture.jpg';
import Custominput from '../../components/Custominput';
import CustomButton from '../../components/CustomButton';

const SignInScreen = () => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigation = useNavigation();

  const onSignInPressed = async (data) => {
    console.log('Form Submitted: ', data);
    try {
      if (!data.email || !data.password) {
        throw new Error('Please fill in all fields.');
      }
      await auth().signInWithEmailAndPassword(data.email, data.password);

      const querySnapshot = await firestore()
        .collection('users')
        .where('email', '==', data.email)
        .get();

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        console.log('User Ob Found -> id: ' + doc.id, ' => ', doc.data());
        Toast.show({
          type: 'success',
          text1: 'Successfully Loged In',
        });
        if (doc.data()?.isVendor) {
          navigation.navigate('Vendor');
        } else {
          navigation.navigate('Customer');
        }
      } else {
        console.log('No matching documents.');
      }
      reset();
    } catch (err) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: `${err?.message?.replace(/\[.*?\]/g, '').trim()}`,
      });
    }
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <Image source={Picture} style={style.picture} />
        <Text style={style.heading}>Welcome</Text>
        <Text style={style.subHeading}>Login To My Account</Text>

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

          <CustomButton text="Sign In" onPress={handleSubmit(onSignInPressed)} />
        </View>

        <Pressable onPress={() => onForgotPasswordPressed()}>
          <Text style={style.forgotPassword}>Forgot Password?</Text>
        </Pressable>
        <Pressable onPress={() => onSignUpPress()} style={style.createAccountContainer}>
          <Text style={style.createAccount}>Don't have an account? </Text>
          <Text style={[style.createAccount, style.createAccountBtn]}>Create one</Text>
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
    fontWeight: '700',
    textAlign: 'center',
    color: 'black',
  },
  subHeading: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  forgotPassword: {
    textAlign: 'right',
    paddingHorizontal: 22,
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 6,
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
});

export default SignInScreen;
