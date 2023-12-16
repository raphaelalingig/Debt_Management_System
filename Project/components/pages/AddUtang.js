import { StyleSheet, View, TouchableOpacity } from "react-native";
import React from "react";
import { EvilIcons } from "@expo/vector-icons";
import { TextInput, Text, Button } from "react-native-paper";
const AddUtang = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.displayPicture}>
          <EvilIcons name="user" size={256} color="black" />
        </View>
        <View style={styles.details}>
          <TextInput
            style={{ height: 30 }}
            placeholder="Item  "
            label="Item:  "
            mode="outlined"
          ></TextInput>
          <TextInput
            style={{ height: 30 }}
            placeholder="Quantity "
            label="Quantity: "
            mode="outlined"
          ></TextInput>

          <View
            style={{
              marginTop: 20,
              gap: 5,
              flexDirection: "row",
              marginLeft: 140,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("ClickforMoreDetails")}
            >
              <Button style={{ backgroundColor: "#DB0202" }}>
                <Text style={{ color: "white" }}>Cancel</Text>
              </Button>
            </TouchableOpacity>
            <TouchableOpacity>
              <Button style={{ backgroundColor: "#13C913" }}>
                <Text style={{ color: "white" }}>Save</Text>
              </Button>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddUtang;

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
