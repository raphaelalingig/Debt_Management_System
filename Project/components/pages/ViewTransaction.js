import { StyleSheet, View, ScrollView, TextInput} from "react-native";
import React, { useState } from "react";
import { DataTable, Text, TouchableRipple, Button  } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import TransactionInfoModal from "../pages/TransactionsInfo";
import API_URL from "../services/apiurl";
import { Print } from "expo";

const Transactions = ({ navigation, route }) => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const { debtorInfo } = route.params;

  useFocusEffect(
    React.useCallback(() => {
      axios
        .get(API_URL + "usertransactions/" + debtorInfo.d_id)
        .then((response) => {
          setTransactions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          console.error("Response data:", error.response.data);
        });
    }, [])
  );
  
  const handlePrintReceipt = async () => {
    // Perform logic to print receipt
    const receiptContent = generateReceiptContent();
    await Print.printAsync({ html: receiptContent });
  };

  const generateReceiptContent = () => {
    // Generate the content of the receipt based on transactions
    // Example: Concatenate transaction details into a string
    let receiptContent = "";
    transactions.forEach((item) => {
      receiptContent += `${item.h_id} | ${item.transaction} | ${item.name} | ${item.date}\n`;
    });
    return receiptContent;
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSearchMode(false); // Cancel search mode
    setSearchDate(""); // Clear search date
  };

  const searchByDate = () => {
    const searchedTransactions = transactions.filter((item) =>
      moment(item.date).isSame(moment(searchDate), "day")
    );
    setTransactions(searchedTransactions);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
      {searchMode ? (
          <View style={styles.searchContainer}>
            <TextInput
            style={styles.searchbox}
              label="Search Date"
              value={searchDate}
              onChangeText={(text) => setSearchDate(text)}
            />
            <Button mode="contained" onPress={searchByDate}>
                Search
              </Button>
              <Button mode="outlined" onPress={handleCancel}>
                Cancel
              </Button>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={() => setSearchMode(true)}>
                Search Date
              </Button>
              <Button mode="contained" onPress={handlePrintReceipt}>
              Print Receipt
            </Button>
          </View>
        )}
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
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    alignItems: "center",
  },
  searchbox: {
    marginRight: 10,
    width: "40%",
    backgroundColor: "#BFCFE7",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
});
