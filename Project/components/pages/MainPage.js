import React, { useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, View, FlatList } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import API_URL from "../services/apiurl";
import { AntDesign } from "@expo/vector-icons";

export default function MainPage({ navigation, route }) {

  const DebtorList = () => {
    
    const [debtors, setDebtors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [due, setDue] = useState("");

    useFocusEffect(
      React.useCallback(() => {
        // Fetch data from the Laravel API endpoint
        axios
          .get(API_URL + 'debtors')
          .then((response) => {
            setDebtors(response.data);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            console.error('Response data:', error.response.data);
          });
      }, []) // The empty dependency array ensures that this effect runs only once when the component mounts
    );

    const calculateDueStatus = (due_date) => {
      const currentDate = new Date();
      const dueDate = new Date(due_date);
  
      if (dueDate.toDateString() === currentDate.toDateString()) {
        return { status: "Due Today", color: "orange" };
      } else if (dueDate < currentDate) {
        return { status: "Overdue", color: "red" };
      } else {
        return { status: "Due", color: "blue" };
      }
    };

    const handleDebtorClick = (item) => {
      const calculatedDueStatus = calculateDueStatus(item.due_date);
  
      navigation.navigate("ClickforMoreDetails", {
        debtorInfo: item,
        uthangsData: item.uthangsData,
        calculatedDueStatus, // Include the calculatedDueStatus in navigation parameters
      });
    };

    const filteredDebtors = debtors.filter((debtor) =>
      debtor.d_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.menuLogo}>
          <MaterialCommunityIcons
            name="menu"
            size={24}
            color="black"
            onPress={() => navigation.toggleDrawer()}
          />
        </TouchableOpacity>

        <View style={styles.inputBoxContainer}>
          <TextInput
            style={styles.searchBox}
            placeholder="Search Name: "
            mode="outlined"
            label={"Search:"}
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
          <FontAwesome
            name="search"
            size={24}
            color="black"
            style={styles.iconSearch}
          />
          <View style={styles.accountIconContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Account")}>
              <MaterialCommunityIcons name="account" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
            onPress={() =>
            navigation.navigate("Transactions")}>
          <View style={styles.transactionButton}>
            <MaterialCommunityIcons
              name="clipboard-check-multiple-outline"
              size={24}
              color="black"
            />
            <Text>Transactions</Text>
          </View>
        </TouchableOpacity>
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
                    <Text style={styles.debtorInfo}>Name: {item.d_name}</Text>
                    <Text style={styles.debtorInfo}>Balance: {item.phone}</Text>
                    <Text>
                      <Text style={{fontSize: 16, marginBottom: 5, color: "black" }}>Status: </Text>
                      <Text style={{ ...styles.debtorInfo, color: calculateDueStatus(item.due_date).color }}>
                        {calculateDueStatus(item.due_date).status}
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
        <AntDesign
          style={styles.plusButton}
          name="pluscircle"
          size={58}
          color="black"
        />
      </TouchableOpacity>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#BAE8E8",
    },
    inputBoxContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: "black",
      borderRadius: 5,
      width: 260,
      left: 80,
    },
    searchBox: {
      flex: 1,
    },
    iconSearch: {
      position: "absolute",
      right: 50,
    },
    menuLogo: {
      top: 40,
      left: 25,
    },
    transactionButton: {
      flexDirection: "row",
      left: 220,
      top: 20,
      marginBottom: 35,
    },
    customersList: {
      backgroundColor: "white",
      width: 310,
      left: 30,
      borderRadius: 15,
      marginBottom: 20,
    },
    userLogo: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
    },
    verticalLine: {
      width: 1,
      height: "auto",
      borderLeftWidth: 2,
      borderColor: "black",
      marginRight: 10,
    },
    userDetails: {
      gap: 4,
    },
    debtorBox: {
      padding: 10,
    },
    debtorInfo: {
      fontSize: 16,
      marginBottom: 5,
    },
    deleteButton: {
      position: "absolute",
      padding: 1,
      backgroundColor: "#FFD803",
      marginTop: 15,
      right: -50,
    },
    plusButton: {
      margin: 20,
      marginTop: 20,
      left: "37%",
    },
    accountIconContainer: {
      marginLeft: '5%', // This will push it to the rightmost side
    },
  });

  return <DebtorList />;
}
