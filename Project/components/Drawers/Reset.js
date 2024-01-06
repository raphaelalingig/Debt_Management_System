import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import API_URL from '../services/apiurl';

const PasswordResetLinkScreen = () => {
  const [email, setEmail] = useState('');

  const handleRequestLink = async () => {
    try {
      const response = await axios.post(API_URL + 'password/reset-link', {
        email,
      });

      if (response.data.status === 'passwords.sent') {
        Alert.alert('Password Reset Link Sent', 'Check your email for the password reset link.');
      } else {
        Alert.alert('Password Reset Link Failed', 'Please check your email and try again.');
      }
    } catch (error) {
      console.error('Error requesting password reset link:', error);
      Alert.alert('Error', 'An error occurred while requesting the password reset link.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />

      {/* Request Password Reset Link button */}
      <Button title="Request Password Reset Link" onPress={handleRequestLink} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default PasswordResetLinkScreen;
