import { StyleSheet, View, TouchableOpacity } from "react-native";
import React from "react";
import { TextInput, Text, Button } from "react-native-paper";

import { EvilIcons } from "@expo/vector-icons";

const ViewDebtRecord = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.displayPicture}>
          <EvilIcons name="user" size={256} color="black" />
        </View>
        <View style={styles.details}>
          <TextInput
            style={{ height: 30 }}
            label="Item: "
            mode="outlined"
          ></TextInput>
          <TextInput
            style={{ height: 30 }}
            label="Quantity: "
            mode="outlined"
          ></TextInput>
          <TextInput
            style={{ height: 30 }}
            label="Price: "
            mode="outlined"
          ></TextInput>
          <TextInput
            style={{ height: 30 }}
            label="Total: "
            mode="outlined"
          ></TextInput>
          <TextInput
            style={{ height: 30 }}
            label="Date: "
            mode="outlined"
            disabled
          ></TextInput>
          <View style={{ marginTop: 20, gap: 5 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ClickforMoreDetails")}
            >
              <Button style={styles.button}>Save</Button>
            </TouchableOpacity>
            <TouchableOpacity>
              <Button style={{ backgroundColor: "#13C913" }}>
                <Text style={{ color: "white" }}>Pay</Text>
              </Button>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ViewDebtRecord;

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
