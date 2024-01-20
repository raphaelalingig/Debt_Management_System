import { StyleSheet, View, TouchableOpacity } from "react-native";
import React from "react";
import { TextInput, Text, Button } from "react-native-paper";

import { EvilIcons } from "@expo/vector-icons";

const DebtorPage = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.displayPicture}>
          <EvilIcons name="user" size={256} color="black" />
        </View>
        
        <View style={styles.details}>
          <TextInput
            style={{ height: 30 }}
            value="2"
            label="User ID: "
            mode="outlined"
            editable={false}

          ></TextInput>
          <TextInput
            style={{ height: 30 }}
            value="Raphael Alingig"
            label="Customer Name: "
            mode="outlined"
            editable={false}

          ></TextInput>
          <TextInput
            style={{ height: 30 }}
            value="Get 1pc. chicken"
            label="Action: "
            mode="outlined"
            editable={false}

          ></TextInput>

          <TextInput
            style={{ height: 30 }}
            value="2023-12-01 10:00 AM"
            label="Date & Time: "
            mode="outlined"
            editable={false}
          ></TextInput>
        </View>
      </View>
    </View>
  );
};

export default DebtorPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#BAE8E8",
  },
  contentContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 30,
    marginTop: 10,
  },
  displayPicture: {},
  details: {
    marginTop: 20,
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    left: 135,
  },
  button: {
    backgroundColor: "#FFD803",
  },
});