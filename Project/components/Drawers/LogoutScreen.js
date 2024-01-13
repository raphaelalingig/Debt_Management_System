// LogoutScreen.js

import React, { useEffect } from 'react';
import { Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutScreen = ({ navigation }) => {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await AsyncStorage.removeItem('authToken');
        navigation.navigate('LoginForms');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    handleLogout();
  }, [navigation]);

  return null; // or you can return a loading indicator or a message
};

export default LogoutScreen;
