import { View, StyleSheet, ScrollView, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Appbar, Avatar, Card, Title } from "react-native-paper";
import {
  DataTable,
  Text,
  TouchableRipple,
  TouchableOpacity,
  Button,
} from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import TransactionInfoModal from "../../pages/TransactionsInfoDebtor";
import API_URL from "../../services/apiurl";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [debtor, setDebtor] = useState([]);
  const [debtorId, setDebtorId] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const storedD_id = await AsyncStorage.getItem("d_id");
          const response = await axios.get(
            API_URL + "usertransactions/" + storedD_id
          );
          setTransactions(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
          console.error("Response data:", error.response.data);
        }
      };

      fetchData(); // Call the async function immediately

      return () => {
        // Clean-up logic if needed
      };
    }, [])
  );
  const handleDownloadReceipt = async () => {
    try {
      const receiptContent = generateReceiptContent();
      const fileName = `Receipt_${new Date().getTime()}.pdf`;

      // Create the PDF file
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, receiptContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Display success message with the file URI
      console.log("Receipt downloaded successfully:", fileUri);

      // You can also show an alert with the file URI
      // Alert.alert('Downloaded Successfully', `File saved at: ${fileUri}`);
    } catch (error) {
      console.error("Error downloading receipt:", error);
    }
  };

  const handlePrintReceipt = async () => {
    // Perform logic to print receipt
    const receiptContent = generateReceiptContent();
    await Print.printAsync({ html: receiptContent });
  };

  const generateReceiptContent = () => {
    // Generate the content of the receipt based on transactions
    // Format the content as an HTML table
    let receiptContent = `
        <html>
          <head>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 10px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              .debtorName {
                font-size: 20px;
                font-weight: bold;
              }
              .totalRow {
                font-weight: bold;
              }
            </style>
          </head>
          <body>
          <p class="debtorName">StoreName: Mark Jundy Store</p>
          <p class="debtorName">Customer: ${debtor.d_name}</p>
            <table>
              <tr>
                <th>ID</th>
                <th>Transaction</th>
                <th>Price</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>`;

    let totalPrice = 0;
    let totalPayment = 0;

    transactions.forEach((item) => {
      receiptContent += `
          <tr>
            <td>${item.h_id}</td>
            <td>${item.transaction}</td>
            <td>${item.price !== null ? item.price : ""}</td>
            <td>${item.payment !== null ? item.payment : ""}</td>
            <td>${item.date}</td>
          </tr>`;

      // Calculate total price and total payment
      totalPrice += item.price !== null ? parseFloat(item.price) : 0;
      totalPayment += item.payment !== null ? parseFloat(item.payment) : 0;
    });

    // Calculate the difference between total price and total payment
    const difference = totalPrice - totalPayment;

    // Add the total row with the difference column
    receiptContent += `
        <tr class="totalRow">
          <td colspan="2">Total</td>
          <td>${totalPrice.toFixed(2)}</td>
          <td>${totalPayment.toFixed(2)}</td>
          <td>${difference.toFixed(2)}</td>
        </tr>
        <tr class="totalRow">
          <td colspan="4"></td>
          <td>Balance</td>
          `;

    receiptContent += `
            </table>
          </body>
        </html>`;

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
          <Button
            mode="contained"
            onPress={() => setSearchMode(true)}
            style={styles.transactionButtons}
          >
            <Text> Search Date </Text>
          </Button>
          <Button
            mode="contained"
            onPress={handlePrintReceipt}
            style={styles.transactionButtons}
          >
            <Text>Print Receipt</Text>
          </Button>
          <Button
            mode="contained"
            onPress={handleDownloadReceipt}
            style={styles.transactionButtons}
          >
            <Text> Download</Text>
          </Button>
        </View>
      )}
      <ScrollView style={{ shadowOpacity: 80, elevation: 15 }}>
        {transactions?.length > 0 ? (
          <DataTable style={styles.table}>
            <DataTable.Header>
              <DataTable.Title style={styles.biggerColumn}>
                Transaction
              </DataTable.Title>
              <DataTable.Title style={{ marginLeft: 20 }}>
                Price
              </DataTable.Title>
              <DataTable.Title style={{ left: 20 }}>Payment</DataTable.Title>
              <DataTable.Title style={{ left: 60 }}>Date</DataTable.Title>
              <DataTable.Title style={{ left: 40 }}>
                <AntDesign name="filter" size={18} color="gray" />
              </DataTable.Title>
            </DataTable.Header>
            {transactions.map((item) => (
              <TouchableRipple
                key={item.h_id}
                onPress={() => {
                  setSelectedTransaction(item);
                  setIsModalVisible(true);
                }}
              >
                <DataTable.Row
                  style={{ flex: 1, justifyContent: "space-evenly" }}
                >
                  <DataTable.Cell style={styles.biggerColumn}>
                    {item.transaction}
                  </DataTable.Cell>
                  <DataTable.Cell>{item.price}</DataTable.Cell>
                  <DataTable.Cell>{item.payment}</DataTable.Cell>
                  <DataTable.Cell>{item.date}</DataTable.Cell>
                </DataTable.Row>
              </TouchableRipple>
            ))}
          </DataTable>
        ) : (
          <Text style={styles.noSalesText}>No current transaction to show</Text>
        )}
        <TransactionInfoModal
          isVisible={isModalVisible}
          onCancel={handleCancel}
          TransacDetails={selectedTransaction}
        />
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
  biggerColumn: {
    flex: 2,
    marginLeft: 20,
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
  transactionButtons: {
    backgroundColor: "#FFD803",
  },
});
