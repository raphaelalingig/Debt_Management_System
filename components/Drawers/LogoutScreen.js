// LogoutScreen.js

import React, { useEffect } from 'react';
import { Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutScreen = ({ navigation }) => {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await AsyncStorage.removeItem('authToken');

        checkAsyncStorage();
        navigation.navigate('LoginForms');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    handleLogout();
  }, [navigation]);
  const checkAsyncStorage = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem("userEmail");
      const storedPassword = await AsyncStorage.getItem("userPassword");
      const storedToken = await AsyncStorage.getItem("authToken");
  
      console.log("Stored Email:", storedEmail);
      console.log("Stored Password:", storedPassword);
      console.log("Stored Token:", storedToken);
    } catch (error) {
      console.error("Error checking AsyncStorage:", error);
    }
  };

  return null; // or you can return a loading indicator or a message
};

export default LogoutScreen;
