
import API_URL from '../services/apiurl';

import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const ResetPasswordScreen = ({route, navigation}) => {
  const { userData } = route.params;
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
      try {
          // Validate that new password and confirm password match
          if (newPassword !== confirmPassword) {
              Alert.alert('Error', 'New Password and Confirm Password must match');
              return;
          }

          const response = await fetch(API_URL + 'reset-password', {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  // Include any additional headers as needed
              },
              body: JSON.stringify({
                  user_id: userData.id,
                  old_password: oldPassword,
                  new_password: newPassword,
              }),
          });

          const data = await response.json();

          if (response.ok) {
              // Password reset successfully
              Alert.alert('Success', data.message);
              navigation.navigate("Account");
          } else {
              // Display error message
              Alert.alert('Error', data.error);
          }
      } catch (error) {
          console.error('Error:', error);
      }
  };

  return (
      <View>
          <TextInput
              placeholder="Old Password"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
          />
          <TextInput
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
          />
          <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
          />
          <Button title="Reset Password" onPress={handleResetPassword} />
      </View>
  );
};

export default ResetPasswordScreen;
