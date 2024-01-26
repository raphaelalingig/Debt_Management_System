import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  BackHandler,
} from "react-native";
import React, { useState, useEffect } from "react";
import { DataTable, Text, TouchableRipple, Button } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import TransactionInfoModal from "../pages/TransactionsInfoDebtor";
import API_URL from "../services/apiurl";
import * as Print from "expo-print";

const Transactions = ({ navigation, route }) => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const { debtorInfo, calculatedDueStatus } = route.params;

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
  useEffect(() => {
    const backAction = () => {
      // Handle the back button press
      // For example, navigate back or perform other actions
      navigation.goBack();
      return true; // Prevent default behavior (exit the app)
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Clean up the event listener when the component is unmounted
    return () => backHandler.remove();
  }, [navigation]);

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
        <p class="debtorName">Customer: ${debtorInfo.d_name}</p>
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
        <td>₱${totalPrice.toFixed(2)}</td>
        <td>₱${totalPayment.toFixed(2)}</td>
        <td>₱${difference.toFixed(2)}</td>
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
    <ScrollView style={{ flex: 1, backgroundColor: "#BAE8E8" }}>
      <View style={styles.container}>
        <Text style={styles.debtorName}>Debtor Name: {debtorInfo.d_name}</Text>
        {searchMode ? (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchbox}
              label="Search Date"
              value={searchDate}
              onChangeText={(text) => setSearchDate(text)}
            />
            <Button
              mode="contained"
              onPress={searchByDate}
              style={styles.button}
            >
              <Text>Search</Text>
              </Button>
              <Button
              mode="outlined"
              onPress={handleCancel}
              style={{ borderColor: "#FFD803" }}
            >
              <Text>Cancel</Text>
              </Button>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => setSearchMode(true)}
              style={styles.button}
            >
              <Text variant="">Search Date</Text>
              </Button>
              <Button
              mode="contained"
              onPress={handlePrintReceipt}
              style={styles.button}
            >
              <Text>Print Receipt</Text>
            </Button>
          </View>
        )}
        {transactions?.length > 0 ? (
          <DataTable style={styles.table}>
            <DataTable.Header>
              <DataTable.Title style={styles.biggerColumn}>
                Transaction
              </DataTable.Title>
              <DataTable.Title>Price</DataTable.Title>
              <DataTable.Title>Payment</DataTable.Title>
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
          <Text style={styles.noSalesText}>
            NO CURRENT Transactions TO SHOW
          </Text>
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
    margin: 15,
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
    backgroundColor: "white",
  borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  debtorName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  searchDateButtons: {
    backgroundColor: "#BAE8E8",
  },
  button: {
    backgroundColor: "#FFD803",
  },
});
