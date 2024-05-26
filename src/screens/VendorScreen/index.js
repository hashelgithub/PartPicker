import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';

import CustomButton from '../../components/CustomButton';
import useLocation from '../../utils/LocationUtil';
import Picture from '../../assets/images/Picture.jpg';
import CustomInput from '../../components/Custominput';

const VendorScreen = () => {
  const [shopName, setShopName] = useState('');
  const [sparePartName, setSparePartName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [telNo, setTelNo] = useState('');

  const location = useLocation();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      if (!shopName || !sparePartName || !price || !quantity || !telNo) {
        throw new Error('Please fill in all fields.');
      }

      const data = {
        shopName,
        sparePartName,
        price: parseFloat(price),
        location: `${location.latitude || ''}, ${location.longitude || ''}`,
        quantity: parseInt(quantity),
        telNo,
      };

      await firestore().collection('vendors').add(data);
      console.log('Data saved to Firestore successfully:', data);
      Toast.show({
        type: 'success',
        text1: 'Successfully Added Spare Part',
      });
      navigation.navigate('SignIn');
      handleReset();
    } catch (err) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: `${err?.message?.replace(/\[.*?\]/g, '').trim()}`,
      });
    }
  };

  const handleReset = () => {
    setShopName('');
    setSparePartName('');
    setPrice('');
    setQuantity('');
    setTelNo('');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={style.container}>
        <Image source={Picture} style={style.picture} />
        <Text style={style.title}>
          Please register your spare part by filling the form below. Your current location will
          capture automatically.
        </Text>

        <CustomInput
          style={style.input}
          value={shopName}
          onChangeText={setShopName}
          placeholder="Name of the shop"
        />

        <CustomInput
          value={sparePartName}
          onChangeText={setSparePartName}
          placeholder="Name of the spare part with the model No"
        />
        <CustomInput
          value={price}
          onChangeText={setPrice}
          placeholder="Price"
          keyboardType="numeric"
        />
        <CustomInput
          value={`${location.latitude || ''}, ${location.longitude || ''}`}
          editable={false}
          placeholder="Location"
        />
        <CustomInput
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Quantity"
          keyboardType="numeric"
        />
        <CustomInput
          value={telNo}
          onChangeText={setTelNo}
          placeholder="Tel No"
          keyboardType="phone-pad"
        />

        <CustomButton text="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 44,
    marginBottom: 10,
    textAlign: 'center',
    color: 'black',
    fontWeight: '800',
  },
  title: {
    fontSize: 16,
    marginVertical: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  picture: {
    width: 450,
    height: 150,
  },
});

export default VendorScreen;
