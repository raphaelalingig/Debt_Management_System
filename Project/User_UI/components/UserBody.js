import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { DataTable, TouchableRipple } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";

const UserBody = () => {
  return (
    <View style={styles.container}>
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
            <DataTable.Cell>12/01/2002</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </ScrollView>
    </View>
  );
};

export default UserBody;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#BAE8E8",
    padding: 20,
  },

  details: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
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
    width: "100%", // Adjust the width as needed
    alignSelf: "center", // Center the DataTable
  },
  tableCell: {
    flex: 1, // Equal flex for all cells
  },
  dateCell: {
    flex: 2, // Adjust the flex value based on your content
  },
});
