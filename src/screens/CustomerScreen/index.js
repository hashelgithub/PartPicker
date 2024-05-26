import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

import SearchBar from '../../components/SearchBar';
import ImageSelector from '../../components/ImageSelector';
import CustomButton from '../../components/CustomButton';
import ViewScreen from '../ViewScreen';
import Picture from '../../assets/images/Picture.jpg';
import Toast from 'react-native-toast-message';

const CustomerScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [nearestShops, setNearestShops] = useState([]);
  const [result, setResult] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  console.log(selectedImage);

  const fetchNearestShops = async () => {
    try {
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(position.coords);
          const shopsSnapshot = await firestore().collection('vendors').get();

          // Filter shops within a 10km radius
          const shopsWithinRadius = shopsSnapshot.docs.filter((doc) => {
            const shopData = doc.data();
            const [latitude2, longitude2] = shopData.location.split(',').map(parseFloat);
            const distance = calculateDistance(latitude, longitude, latitude2, longitude2);
            return distance <= 10; // Check if the distance is within 10km
          });

          const shops = shopsWithinRadius.map((doc) => doc.data());
          console.log('Nearest Vendors: ', shops);
          setNearestShops(shops);
          console.log(shopsSnapshot);
        },
        (error) => console.log('Error getting current location:', error)
      );
    } catch (error) {
      console.log('Error fetching nearest shops:', error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
    const dLon = (lon2 - lon1) * (Math.PI / 180); // Convert degrees to radians
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  const handleSubmit = async () => {
    try {
      if (!selectedImage) {
        throw new Error('No image selected');
      }
      console.log('selectedImage', selectedImage);
      const prediction = await getPrediction(selectedImage);
      if (prediction.class) {
        setPredictionResult(prediction);
        checkNearestShop(prediction.class);
      } else {
        throw new Error('Failed to predict');
      }
    } catch (err) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: `${err?.message?.replace(/\[.*?\]/g, '').trim()}`,
      });
    }
  };

  const getPrediction = async (uri) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        name: 'image.jpg',
        type: 'image/jpeg',
      });

      const response = await axios.post(
        'https://us-central1-spare-parts-classification.cloudfunctions.net/predict',
        formData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('response-', response.data);
      return response.data;
    } catch (err) {
      console.log('Prediction error:', err);
      throw err;
    }
  };

  const handleSelectImage = (response) => {
    if (typeof response !== 'undefined') {
      const uri = response.assets[0].uri;
      setSelectedImage(uri);
      setPredictionResult(null);
    }
  };

  const checkNearestShop = async (predictedLabel) => {
    console.log('filteredShops', nearestShops);
    console.log('predictedLabel', predictedLabel);
    const filteredShops = nearestShops.filter((shop) => shop.sparePartName === predictedLabel);
    if (filteredShops.length > 0) {
      setResult(filteredShops);
      setModalVisible(true);
    } else {
      console.log('No nearby shops found for the predicted label');
      Toast.show({
        type: 'error',
        text1: 'No nearby shops found for the predicted label',
      });
    }
  };

  useEffect(() => {
    fetchNearestShops();
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={style.container}>
        <Image source={Picture} style={style.picture} />
        <Text style={style.description}>PartPicker Your Personal Spare Part Locator</Text>
        <SearchBar placeholder="Search" />
        <ImageSelector onSelectImage={handleSelectImage} />
        {predictionResult && (
          <View style={style.predictionContainer}>
            <Text style={style.labelText}>Label: {predictionResult.class}</Text>
            <Text style={style.labelText}>
              Confidence: {parseFloat(predictionResult.confidence).toFixed(2)}%
            </Text>
          </View>
        )}
        <CustomButton text="Submit" onPress={handleSubmit} />
      </View>
      <ViewScreen shops={result} modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 24,
    marginVertical: 20,
    paddingHorizontal: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  predictionContainer: {
    alignItems: 'center',
  },
  labelText: {
    fontSize: 20,
    marginTop: 10,
  },
  picture: {
    width: 450,
    height: 150,
  },
});

export default CustomerScreen;
