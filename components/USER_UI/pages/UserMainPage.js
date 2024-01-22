import React from "react";
import UserHeader from "../components/UserHeader";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";

const UserMainPage = () => {
  return (
    <View style={styles.container}>
      <UserHeader />
        <View style={styles.details}>
          <View style={styles.logo}>
            <FontAwesome name="user" size={84} color="black" />
          </View>
          <View style={styles.info}>
            <Text>Name: John Doe</Text>
            <Text>Phone: (123) 456-7890</Text>
            <Text>Address: 123 Main St</Text>
            <Text>Email: john.doe@example.com</Text>
          </View>
        </View>
        <ScrollView style={{ maxHeight: 300 }}>
          <DataTable style={styles.table}>
            <DataTable.Header>
              <DataTable.Title>Qty.</DataTable.Title>
              <DataTable.Title>Item</DataTable.Title>
              <DataTable.Title>Price</DataTable.Title>
              <DataTable.Title>Total</DataTable.Title>
              <DataTable.Title>Date</DataTable.Title>
            </DataTable.Header>
            <DataTable.Row>
              <DataTable.Cell>2</DataTable.Cell>
              <DataTable.Cell>Beer</DataTable.Cell>
              <DataTable.Cell>₱85.00</DataTable.Cell>
              <DataTable.Cell>₱120.00</DataTable.Cell>
              <DataTable.Cell >12/01/2002</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </ScrollView>
    </View>
  );
};

export default UserMainPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#BAE8E8",
    flex: 1

  },

  details: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    marginRight: 20,
    marginLeft: 20,
    shadowOpacity: 80,
    elevation: 15,

  
  },
  logo: {
    marginRight: 20,
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 15,
  },
  info: {
    flex: 1,
    
  },
  table: {
    marginTop: 20,
    backgroundColor: "white",
    width: "100%",
    alignSelf: "center",
    shadowOpacity: 80,
    elevation: 15,
  },
  tableCell: {
    flex: 1,
  },
  dateCell: {
    flex: 2,
  },
});
