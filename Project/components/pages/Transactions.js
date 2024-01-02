import { StyleSheet, View, ScrollView } from "react-native";
import React, { useState } from "react";
import { DataTable, Text, TouchableRipple } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import TransactionInfoModal from "../pages/TransactionsInfo";
import API_URL from "../services/apiurl";

const Transactions = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      axios
        .get(API_URL + "transactions")
        .then((response) => {
          setTransactions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          console.error("Response data:", error.response.data);
        });
    }, [])
  );

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        {transactions?.length > 0 ? (
          <DataTable style={styles.table}>
            <DataTable.Header>
              <DataTable.Title style={styles.smallerColumn}>ID</DataTable.Title>
              <DataTable.Title style={styles.biggerColumn}>Transaction</DataTable.Title>
              <DataTable.Title>Debtor</DataTable.Title>
              <DataTable.Title>Date</DataTable.Title>
            </DataTable.Header>

            {transactions.map((item) => (
              <TouchableRipple
                key={item.h_id}
                onPress={() => {
                  setSelectedTransaction(item);
                  setIsModalVisible(true);
                }}
              >
                <DataTable.Row>
                  <DataTable.Cell style={styles.smallerColumn}>{item.h_id}</DataTable.Cell>
                  <DataTable.Cell style={styles.biggerColumn}>{item.transaction}</DataTable.Cell>
                  <DataTable.Cell>{item.name}</DataTable.Cell>
                  <DataTable.Cell>{item.date}</DataTable.Cell>
                </DataTable.Row>
              </TouchableRipple>
            ))}
          </DataTable>
        ) : (
          <Text style={styles.noSalesText}>NO CURRENT Transactions TO SHOW</Text>
        )}
        <TransactionInfoModal
          isVisible={isModalVisible}
          onCancel={handleCancel}
          TransacDetails={selectedTransaction}
        />
      </View>
    </ScrollView>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#BAE8E8",
  },
  table: {
    padding: 5,
    backgroundColor: "white",
    margin: 5,
  },
  smallerColumn: {
    flex: 0.7,
  },
  biggerColumn: {
    flex: 2,
  },
  noSalesText: {
    alignSelf: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
