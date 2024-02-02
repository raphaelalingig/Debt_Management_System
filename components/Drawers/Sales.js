import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import {
  DataTable,
  Text,
  Button,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import axios from "axios";
import SalesInfoModal from "../Drawers/SalesInfo";
import API_URL from "../services/apiurl";
import moment from "moment";
import * as Print from "expo-print";

const Sales = ({ navigation }) => {
  const [sales, setSales] = useState([]);
  const [originalSales, setOriginalSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchDate, setSearchDate] = useState("");

  // Use useFocusEffect to refetch data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(API_URL + "sales");
          setSales(response.data);
          setOriginalSales(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
          console.error("Response data:", error.response.data);
        }
      };

      fetchData();
    }, [navigation]) // Add navigation as a dependency
  );

  const grandTotal = sales
    .filter(
      (item) =>
        typeof item.price === "number" ||
        (typeof item.price === "string" && item.price.trim() !== "")
    )
    .reduce((sum, item) => sum + parseFloat(item.price), 0);

  const handleCancel = () => {
    setIsModalVisible(false);
    setSearchMode(false); // Cancel search mode
    setSearchDate(""); // Clear search date
  };

  const filterTodaySales = () => {
    const todaySales = originalSales.filter((item) =>
      moment(item.sale_date).isSame(moment(), "day")
    );
    setSales(todaySales);
  };

  const handlePrintReceipt = async () => {
    const receiptContent = generateReceiptContent();
    await Print.printAsync({ html: receiptContent });
  };

  const generateReceiptContent = () => {

    item.debtor_name

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
        <p class="debtorName">Sales Invoice</p>
          <table>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Debtor</th>
              <th>Date</th>
            </tr>`;
  
    let totalPayment = 0;
  
    sales.forEach((item) => {
      receiptContent += `
        <tr>
          <td>${item.sale_id}</td>
          <td>${item.item_name}</td>
          <td>${item.quantity_sold}</td>
          <td>${item.price}</td>
          <td>${item.debtor_name}</td>
          <td>${item.sale_date}</td>
        </tr>`;
  
      totalPayment += parseFloat(item.price) || 0;
    });
  
    receiptContent += `
      <tr class="totalRow">
        <td colspan="2">Total</td>
        <td></td>
        <td>₱${totalPayment.toFixed(2)}</td>
        <td></td>
      </tr>
    </table>
      </body>
    </html>`;
  
    return receiptContent;
  };
  

  const showAllSales = async () => {
    try {
      const response = await axios.get(API_URL + "sales");
      setSales(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      console.error("Response data:", error.response.data);
    }
  };

  const searchByDate = () => {
    const searchedSales = originalSales.filter((item) =>
      moment(item.sale_date).isSame(moment(searchDate), "day")
    );
    setSales(searchedSales);
  };

  return (
    <ScrollView
      style={{ backgroundColor: "white" }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={styles.tableSales}>
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
              style={styles.buttonStyle}
            >
              <Text>Search</Text>
            </Button>
            <Button mode="outlined" onPress={handleCancel}>
              <Text>Cancel</Text>
            </Button>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={showAllSales}
              style={styles.buttonStyle}
            >
              <Text>All</Text>
            </Button>
            <Button
              mode="contained"
              onPress={filterTodaySales}
              style={styles.buttonStyle}
            >
              <Text>Today</Text>
            </Button>
            <Button
              mode="contained"
              onPress={handlePrintReceipt}
              style={styles.button}
            >
              <Text>Print Receipt</Text>
            </Button>
            <Button
              mode="contained"
              onPress={() => setSearchMode(true)}
              style={styles.buttonStyle}
            >
              <Text>Search Date</Text>
            </Button>
          </View>
        )}

        <View style={styles.intable}>
          {sales?.length > 0 ? (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Id</DataTable.Title>
                <DataTable.Title>Item</DataTable.Title>
                <DataTable.Title>Quantity</DataTable.Title>
                <DataTable.Title>Price</DataTable.Title>
                <DataTable.Title>Debtor</DataTable.Title>
                <DataTable.Title>Date</DataTable.Title>
              </DataTable.Header>

              {sales.map((item) => (
                <TouchableRipple
                  key={item.sale_id}
                  onPress={() => {
                    setSelectedSale(item);
                    setIsModalVisible(true);
                  }}
                >
                  <DataTable.Row>
                    <DataTable.Cell>{item.sale_id}</DataTable.Cell>
                    <DataTable.Cell>{item.item_name}</DataTable.Cell>
                    <DataTable.Cell>{item.quantity_sold}</DataTable.Cell>
                    <DataTable.Cell>₱{item.price}</DataTable.Cell>
                    <DataTable.Cell>{item.debtor_name}</DataTable.Cell>
                    <DataTable.Cell>{item.sale_date}</DataTable.Cell>
                  </DataTable.Row>
                </TouchableRipple>
              ))}

              {/* Grand Total Row */}
              <DataTable.Row>
                <DataTable.Cell></DataTable.Cell>
                <DataTable.Cell></DataTable.Cell>
                <DataTable.Cell></DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.tableTitle}>Grand Total:</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.tableTitle}>
                    {" "}
                    ₱{grandTotal.toFixed(2)}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          ) : (
            <Text style={styles.noSalesText}>NO CURRENT SALES TO SHOW</Text>
          )}
          <SalesInfoModal
            isVisible={isModalVisible}
            onCancel={handleCancel}
            saleDetails={selectedSale}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Sales;

const styles = StyleSheet.create({
  intable: {
    flex: 1,
    margin: 10,
    padding: 5,
    backgroundColor: "white",
  },

  tableSales: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    padding: 5,
    backgroundColor: "white",
    width: 370,
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 20,
  },

  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },

  searchContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    padding: 10,
    alignItems: "center",
  },

  tableTitle: {
    fontWeight: "bold",
  },

  noSalesText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },

  searchbox: {
    width: "40%",
    backgroundColor: "white",
    color: "black",
  },
  buttonStyle: {
    backgroundColor: "#FFD803",
    color: "black",
  },
});
