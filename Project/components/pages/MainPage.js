import "react-native-gesture-handler";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { TextInput, Button, Text } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";


const MainPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuLogo}>
        <MaterialCommunityIcons
          name="menu"
          size={24}
          color="black"
          onPress={() => navigation.toggleDrawer()}
        />
      </TouchableOpacity>
      <View style={styles.inputBoxContainer}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search Name: "
          mode="outlined"
          label={"Search:"}
        />
        <FontAwesome
          name="search"
          size={24}
          color="black"
          style={styles.iconSearch}
        />
      </View>
      <TouchableOpacity>
        <View style={styles.transactionButton}>
          <MaterialCommunityIcons
            name="clipboard-check-multiple-outline"
            size={24}
            color="black"
          />
          <Text>Transactions</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.customersList}>
        <View style={{ flexDirection: "row" }}>
          <Feather
            name="user"
            size={72}
            color="black"
            style={styles.userLogo}
          />
          <View style={styles.verticalLine}></View>
          <View style={styles.userDetails}>
            <Text>Name: </Text>
            <Text>Date Started: </Text>
            <Text>Total Balance: </Text>
            <TouchableOpacity>
              <Text style={{ marginLeft: 8, color: "gray" }}>
                Click for more details:
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Button style={styles.deleteButton}>
              <Text>DELETE</Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MainPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BAE8E8",
  },
  inputBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "black",
    borderRadius: 5,
    width: 260,
    left: 80,
  },
  searchBox: {
    flex: 1,
  },
  iconSearch: {
    position: "absolute",
    right: 15,
  },
  menuLogo: {
    top: 40,
    left: 25,
  },
  transactionButton: {
    flexDirection: "row",
    left: 220,
    top: 20,
    marginBottom: 35,
  },
  customersList: {
    backgroundColor: "white",
    width: 310,
    left: 30,
    borderRadius: 15,
  },
  userLogo: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  verticalLine: {
    width: 1,
    height: "auto",
    borderLeftWidth: 2,
    borderColor: "black",
    marginRight: 10,
  },
  userDetails: {
    gap: 4,
  },
  deleteButton: {
    position: "absolute",
    padding: 1,
    backgroundColor: "#FFD803",
    marginTop: 15,
    right: -50,
  },
});
