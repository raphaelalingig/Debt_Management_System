import { View, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { Appbar, Avatar, Button, Card, Text, Title } from "react-native-paper";
import { DataTable } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";

const Transactions = () => {
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.headerContainer}>
        <Appbar.Content
          title={<Title style={styles.titleMedium}>Transactions</Title>}
        />
        <Appbar.Action
          icon="clipboard-edit-outline"
          size={45}
          onPress={() => {}}
        />
      </Appbar.Header>

      <ScrollView style={{ maxHeight: 300, shadowOpacity: 80, elevation: 15 }}>
        <DataTable style={styles.table}>
          <DataTable.Header>
            <DataTable.Title>Qty.</DataTable.Title>
            <DataTable.Title style={{ marginLeft: 20 }}>Item</DataTable.Title>
            <DataTable.Title style={{ left: 20 }}>Total</DataTable.Title>
            <DataTable.Title style={{ left: 60 }}>Date</DataTable.Title>
            <DataTable.Title style={{ left: 40 }}>
              <AntDesign name="filter" size={18} color="gray" />
            </DataTable.Title>
          </DataTable.Header>
          <DataTable.Row style={{ flex: 1, justifyContent: "space-evenly" }}>
            <DataTable.Cell>2</DataTable.Cell>
            <DataTable.Cell>Beer</DataTable.Cell>
            <DataTable.Cell>₱120.00</DataTable.Cell>
            <DataTable.Cell>12/01/2002</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </ScrollView>
    </View>
  );
};

export default Transactions;
const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#BAE8E8",
    marginBottom: 25,
  },
  titleMedium: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#BAE8E8",
  },
  table: {
    flex: 1,
    alignSelf: "center",
    backgroundColor: "white",
    shadowOpacity: 80,
    elevation: 15,
  },
});
