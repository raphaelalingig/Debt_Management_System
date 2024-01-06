import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Card, Title, Paragraph } from 'react-native-paper';
import API_URL from '../services/apiurl';

const AccountPage = ({ route }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        };
        const response = await axios.get(API_URL + 'user-data', { headers });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      navigation.navigate('Intro');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Update the handleResetPassword function in your React Native code

const handleResetPassword = async () => {
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    const payload = {
      email: userData.email,
    };

    const response = await axios.post(API_URL + 'send-reset-email', payload, { headers });

    console.log('Password reset email sent successfully:', response.data);
    alert('Password reset email sent successfully. Check your email.');
  } catch (error) {
    console.error('Error sending password reset email:', error.response);
    // Handle the error, e.g., show an error message
    alert('Failed to send password reset email. Please try again.');
  }
};

  

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Feather
        name="user"
        size={72}
        color="black"
        style={styles.userLogo}
      />
      {userData ? (
        <Card style={{ marginVertical: 20, width: '100%' }}>
          <Card.Content>
            <Title>User Information</Title>
            <Paragraph>User ID: {userData.id}</Paragraph>
            <Paragraph>Name: {userData.name}</Paragraph>
            <Paragraph>Email: {userData.email}</Paragraph>
            <Paragraph>Previledges: {userData.role}</Paragraph>
          </Card.Content>
        </Card>
      ) : (
        <Text>Error fetching user data</Text>
      )}
      <Button title="Reset Password" onPress={() => navigation.navigate("ResetPassword",{userData})} disabled={loading} />

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = {
  userLogo: {
    marginBottom: 20,
  },
};

export default AccountPage;
