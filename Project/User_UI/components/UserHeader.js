import { StyleSheet, View } from "react-native";
import React from "react";
import { Appbar, Avatar, Button, Card, Text, Title } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";

const UserHeader = () => {
  return (
    <Appbar.Header style={styles.container}>
      <Appbar.Content
        title={<Title style={styles.titleMedium}>Debtor</Title>}
      />
      <Appbar.Action icon="account-circle" size={45} onPress={() => {}} />
    </Appbar.Header>
    
  );
};

export default UserHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#BAE8E8",
  },
  titleMedium: {
    fontSize: 25,
    fontWeight: "bold",
  },
  content: {},
});
