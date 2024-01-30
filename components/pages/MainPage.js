import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, View, FlatList } from "react-native";
import { TextInput, Button, Text, Searchbar } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import API_URL from "../services/apiurl";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MainPage({ navigation, route }) {
  const [debtors, setDebtors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [balances, setBalances] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      // Fetch data from the Laravel API endpoint
      axios
        .get(API_URL + "debtors")
        .then((response) => {
          const fetchedDebtors = response.data;

          if (Array.isArray(fetchedDebtors)) {
            // Calculate balances for each debtor
            const updatedDebtors = fetchedDebtors.map((debtor) => {
              const newBalance = debtor.totalAmount || 0;

              if (balances[debtor.d_id] !== newBalance) {
                setBalances((prevBalances) => ({
                  ...prevBalances,
                  [debtor.d_id]: newBalance,
                }));
              }

              return {
                ...debtor,
                totalAmount: newBalance,
              };
            });

            setDebtors(updatedDebtors);
          } else {
            console.error("Invalid response format:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          console.error("Response data:", error.response.data);
        });
    }, [])
  );

  const calculateStatusColor = (status) => {
    if (status === "Not Due") {
      return { color: "black" };
    } else if (status === "Due") {
      return { color: "blue", fontWeight: "bold" };
    } else if (status === "Due Today") {
      return { color: "orange", fontWeight: "bold" };
    } else if (status === "Overdue") {
      return { color: "red", fontWeight: "bold" };
    }
  };

  const handleDebtorClick = (item) => {
    navigation.navigate("ClickforMoreDetails", {
      debtorInfo: item,
      uthangsData: item.uthangsData,
    });
  };

  const filteredDebtors = debtors.filter((debtor) =>
    debtor.d_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuLogo}>
            <MaterialCommunityIcons
              name="menu"
              size={24}
              color="black"
              onPress={() => navigation.toggleDrawer()}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search Name: "
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
            style={{ backgroundColor: "white" }}
          />
        </View>
        <View style={styles.accountContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Account")}>
            <MaterialCommunityIcons name="account" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {/* CUUUUTTTTT */}

      <View style={styles.transactionContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Transactions")}>
          <View style={styles.rowAligned}>
            <MaterialCommunityIcons
              name="clipboard-check-multiple-outline"
              size={24}
              color="black"
            />
            <Text>Transactions</Text>
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredDebtors}
        keyExtractor={(item) => item.d_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleDebtorClick(item)}>
            <View style={styles.customersList}>
              <View style={{ flexDirection: "row" }}>
                <Feather
                  name="user"
                  size={72}
                  color="black"
                  style={styles.userLogo}
                />
                <View style={styles.verticalLine}></View>
                <View style={styles.userDetails}>
                  <View style={styles.debtorBox}>
                    {item.showDebtorId ? (
                      <Text style={styles.debtorInfo}>Id: {item.d_id}</Text>
                    ) : null}
                    <Text style={styles.debtorInfo}>
                      Name:{" "}
                      <Text style={styles.debtorInfo1}>{item.d_name}</Text>
                    </Text>
                    <Text style={styles.debtorInfo}>
                      Balance: ₱
                      <Text style={styles.debtorInfo1}>
                        {balances[item.d_id] || 0}
                      </Text>
                    </Text>
                    <Text>
                      <Text style={styles.debtorInfo}>Status: </Text>
                      <Text
                        style={{
                          ...styles.debtorInfo1,
                          color: calculateStatusColor(item.status).color,
                          fontWeight: calculateStatusColor(item.status)
                            .fontWeight,
                        }}
                      >
                        {item.status}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity onPress={() => navigation.navigate("AddDebtor")}>
        <View style={styles.plusButtonContainer}>
          <AntDesign
            name="pluscircle"
            size={58}
            color="black"
            style={styles.plusButton}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BAE8E8",
    alignItems: "center",
  },
  header: {
    position: "relative",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center", // Add this line
    position: "relative",
    marginTop: 20,
  },

  searchContainer: {
    flex: 2,
  },
  menuContainer: {
    marginLeft: 20,
    marginRight: 20,
  },
  accountContainer: {
    marginRight: 20,
    marginLeft: 20,
  },
  transactionContainer: {
    position: "relative",
    marginLeft: 160,
    marginTop: 10,
    marginBottom: 20,
  },
  rowAligned: {
    flexDirection: "row",
  },
  customersList: {
    backgroundColor: "white",
    marginBottom: 15,
    borderRadius: 20,
    padding: 20,
  },
  userLogo: { padding: 10, marginRight: 5 },
  verticalLine: {
    width: 1,
    height: "auto",
    borderLeftWidth: 2,
    borderColor: "black",
    marginRight: 10,
  },
  userDetails: { padding: 10 },
  plusButton: {
    marginBottom: 10,

  },
  
});

// No return outside of the function
