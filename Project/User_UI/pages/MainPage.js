import { StyleSheet, Text, View } from "react-native";
import React from "react";
import UserHeader from "../components/UserHeader";
import UserBody from "../components/UserBody";

const MainPage = () => {
  return (
    <View style={styles.container}>
      <UserHeader />
      <UserBody />
    </View>
  );
};

export default MainPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#BAE8E8",

  },
});
