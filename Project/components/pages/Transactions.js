import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { EvilIcons } from "@expo/vector-icons";
import { DataTable, Text, Button, TouchableRipple } from "react-native-paper";

const Transactions = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title>User ID</DataTable.Title>
          <DataTable.Title>Customer Name</DataTable.Title>
          <DataTable.Title>Date & Time</DataTable.Title>
          <DataTable.Title>Action</DataTable.Title>
        </DataTable.Header>

        <TouchableRipple
          onPress={() =>
            navigation.navigate("ViewTransaction", { screen: "ViewTransaction" })
          }
        >
          <DataTable.Row>
            <DataTable.Cell style={{ flex: 1 }}>2</DataTable.Cell>
            <DataTable.Cell style={{ flex: 2 }}>
              <Text variant="bodySmall" style={{}}>
                Raphael Alingig
              </Text>
            </DataTable.Cell>
            <DataTable.Cell numeric style={{ flex: 1 }}>
              <Text variant="bodySmall" style={{}}>
                {" "}
                2023-12-01 10:00 AM
              </Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 2, marginLeft: 5 }}>
              <Text variant="bodySmall" style={{}}>
                Get 1pc. chicken
              </Text>
            </DataTable.Cell>
          </DataTable.Row>
        </TouchableRipple>
      </DataTable>
    </View>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BAE8E8",
  },
  table: {
    padding: 5,
    backgroundColor: "white",
    margin: "5",
  },
});
