import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

import Custominput from '../../components/Custominput';
import CustomButton from '../../components/CustomButton';
import Picture from '../../assets/images/Picture.jpg';

const ForgotPasswordScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigation = useNavigation();

  const onSendPressed = async (data) => {
    try {
      if (!data.email) {
        throw new Error('Please enter your email address.');
      }
      await auth().sendPasswordResetEmail(data.email);
      Toast.show({
        type: 'success',
        text1: 'Reset Email Sent',
        text2: 'Please check your email to reset your password.',
      });
      navigation.navigate('SignIn');
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
        <Text style={style.title}>Reset your password</Text>

        <View style={style.container}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Custominput
                placeholder="Email"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
            name="email"
            defaultValue=""
          />
          {errors.email && <Text style={style.errorText}>{errors.email.message}</Text>}

          <CustomButton text="Send" onPress={handleSubmit(onSendPressed)} />
        </View>
        <Pressable onPress={() => onSignInPress()}>
          <Text style={style.forgotPassword}>Back to Sign in</Text>
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
  title: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    color: 'black',
    marginVertical: 12,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 5,
  },
  forgotPassword: {
    textAlign: 'right',
    paddingHorizontal: 22,
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 6,
  },
});

export default ForgotPasswordScreen;
