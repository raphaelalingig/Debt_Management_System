import { StyleSheet, View, TouchableOpacity } from "react-native";
import React from "react";
import { EvilIcons } from "@expo/vector-icons";
import { TextInput, Text, Button } from "react-native-paper";
import ClickforMoreDetails from "./ClickforMoreDetails";

const EditProfile = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.displayPicture}>
          <EvilIcons name="user" size={256} color="black" />
        </View>
        <View style={styles.details}>
          <TextInput
            style={{ height: 30 }}
            placeholder="Name: "
            label="Name: "
            mode="outlined"
          ></TextInput>
          <TextInput
            style={{ height: 30 }}
            placeholder="Phone Number: "
            label="Phone Number: "
            mode="outlined"
          ></TextInput>
          <TextInput
            style={{ height: 30 }}
            placeholder="Address: "
            label="Address: "
            mode="outlined"
          ></TextInput>
          <View style={{marginTop: 20, gap: 5}}>
            <TouchableOpacity onPress={() => navigation.navigate("ClickforMoreDetails")}>
              <Button style={styles.button}>Cancel</Button>
            </TouchableOpacity>
            <TouchableOpacity>
              <Button style={styles.button}>Save</Button>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EditProfile;

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
