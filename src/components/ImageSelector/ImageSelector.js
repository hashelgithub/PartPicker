import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Image as ImageIcon } from 'lucide-react-native';

const ImageSelector = ({ onSelectImage }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
        if (!response.didCancel) {
          setSelectedImage({ uri: response.assets[0].uri });
          onSelectImage(response);
        }
      }
    );
  };

  return (
    <>
      <TouchableOpacity onPress={handleGallery} style={styles.container}>
        <ImageIcon size={50} color="black" />
        <Text>Open Gallery</Text>
      </TouchableOpacity>
      {selectedImage && <Image source={selectedImage} style={styles.image} resizeMode="cover" />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
});

export default ImageSelector;
