// MailPage.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MailPage = ({ route }) => {
  const { mailContent } = route.params;
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage(mailContent);
  }, [mailContent]);

  return (
    <View style={styles.container}>
      <Text style={styles.mailText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mailText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MailPage;
