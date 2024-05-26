import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Linking, TouchableOpacity } from 'react-native';

const ViewScreen = ({ shops, modalVisible, setModalVisible }) => {
  const openMaps = (location) => {
    const [latitude, longitude] = location.split(',').map(parseFloat);
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Shop Details</Text>
            {shops.length > 0 ? (
              shops.map((shop, index) => (
                <View style={styles.vendorContainer} key={index}>
                  <Text style={styles.vendorHeading}>Vendor {index + 1}</Text>
                  <Text style={styles.label}>Name of the shop:</Text>
                  <Text style={styles.value}>{shop.shopName}</Text>

                  <Text style={styles.label}>Name of the spare part:</Text>
                  <Text style={styles.value}>{shop.sparePartName}</Text>

                  <Text style={styles.label}>Price:</Text>
                  <Text style={styles.value}>{shop.price}</Text>

                  <TouchableOpacity onPress={() => openMaps(shop.location)}>
                    <Text style={[styles.label, { color: 'black' }]}>
                      Location: (Tap to open in Maps)
                    </Text>
                    <Text style={styles.value}>{shop.location}</Text>
                  </TouchableOpacity>

                  <Text style={styles.label}>Quantity:</Text>
                  <Text style={styles.value}>{shop.quantity}</Text>

                  <Text style={styles.label}>Telephone Number:</Text>
                  <Text style={styles.value}>{shop.telNo}</Text>
                </View>
              ))
            ) : (
              <Text>No shop details found</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: '90%',
    maxHeight: '90%',
  },
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  vendorContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
  vendorHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
  },
});

export default ViewScreen;
