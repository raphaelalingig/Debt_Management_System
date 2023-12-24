import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ConfirmationModal from './Confirmation'; // Import the Modal component

const YourComponent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleConfirm = () => {
    // Handle the "Yes" button click
    setIsModalVisible(false);
    // Add your confirmation logic here
  };

  const handleCancel = () => {
    // Handle the "No" button click
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <Text>Show Confirmation</Text>
      </TouchableOpacity>

      {/* Render the ConfirmationModal component */}
      <ConfirmationModal
        isVisible={isModalVisible}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default YourComponent;
