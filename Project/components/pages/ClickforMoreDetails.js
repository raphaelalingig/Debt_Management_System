import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { EvilIcons } from "@expo/vector-icons";
import { DataTable, Text, Button, TouchableRipple } from "react-native-paper";
import EditProfile from "./EditProfile";
import ViewDebtRecord from "./ViewDebtRecord";
const ClickforMoreDetails = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.displayPicture}>
          <EvilIcons name="user" size={256} color="black" />
        </View>
        <View style={styles.details}>
          <Text>Name: </Text>
          <Text>Phone Number: </Text>
          <Text>Address:</Text>
          <Text>Last Updated:</Text>
        </View>
        <View style={{ flexDirection: "row", marginTop: 15, left: 60, gap: 5 }}>
          <TouchableOpacity
            style={{ backgroundColor: "#FFD803", borderRadius: 20 }}
          >
            <Button>
              <Text>Transactions</Text>
            </Button>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: "#FFD803", borderRadius: 20 }}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Button>
              <Text>Edit Profile</Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tableDebt}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Title</DataTable.Title>
            <DataTable.Title>Quantity</DataTable.Title>
            <DataTable.Title>Price</DataTable.Title>
            <DataTable.Title>Total</DataTable.Title>
            <DataTable.Title>Date</DataTable.Title>
          </DataTable.Header>

          <TouchableRipple
            onPress={() => navigation.navigate("ViewDebtRecord")}
          >
            <DataTable.Row>
              <DataTable.Cell style={{ flex: 2 }}>sample</DataTable.Cell>
              <DataTable.Cell numeric style={{ flex: 1, marginRight: 10 }}>
                3
              </DataTable.Cell>
              <DataTable.Cell numeric style={{ flex: 1, marginLeft: 10 }}>
                300
              </DataTable.Cell>
              <DataTable.Cell numeric style={{ flex: 2, marginRight: 4 }}>
                500
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 3, marginLeft: 10 }}>
                12/01/2002
              </DataTable.Cell>
            </DataTable.Row>
          </TouchableRipple>
        </DataTable>
      </View>
    </View>
  );
};

export default ClickforMoreDetails;

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
  tableDebt: {
    padding: 5,
    backgroundColor: "white",
    width: 370,
    borderRadius: 30,
    marginTop: 10,
  },
  tableTitle: {
    fontWeight: "bold",
  },
});
