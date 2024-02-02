import React from "react";
import UserHeader from "../components/UserHeader";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TouchableHighlight, ActivityIndicator, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";
import { useState, useEffect, useCallback, useFocusEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from "../../services/apiurl";
import base64 from 'base64-js';


const UserMainPage = () => {
  const [userData, setUserData] = useState([]);
  const [debtorId, setDebtorId] = useState('');
  const [debtor, setDebtor] = useState([]);
  const [uthangsData, setUthangsData] = useState([]);
  const [due_fee, setDue_fee] = useState(0);
  const [color, setColor] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const [image, setImage] = useState(null);
  const [interestFee, setInterestFee] = useState(0.00);
  const [totalAmount, setTotalAmount] = useState(0.00);
  const [overDue, setOverdue] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        };
        const response = await axios.get(API_URL + 'user-data', { headers });
        setUserData(response.data);
        setDebtorId(response.data.d_id);
        
        await AsyncStorage.setItem('d_id', response.data.d_id.toString());

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };


    fetchUserData();
  }, []);

  const fetchData = useCallback(() => {
    if (userData?.d_id) {
      axios
        .get(API_URL + 'debtor/' + userData.d_id)
        .then((response) => {
          const { debtor, totalAmount, interest } = response.data;
          setDebtor(debtor);
          setTotalAmount(totalAmount);
          setInterestFee(interest);
          calculateStatusColor(debtor);
      })
        .catch((error) => {
          console.error('Error fetching data:', error);
          console.error('Response data:', error.response.data);
        });
    }
  
    if (userData?.d_id) {
      axios
        .get(API_URL + 'uthangs/' + userData.d_id)
        .then((response) => {
          setUthangsData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching uthangs data:', error);
        });
    }
  }, [userData, totalAmount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const getImage = async () => {
      try {
        const response = await axios.get(API_URL + 'getImage/' + userData.d_id, {
          responseType: 'arraybuffer',
        });
    
        if (response.status !== 200) {
          console.error("Error fetching picture:", response.data.error);
          // Handle other non-404 errors if needed
        } else {
          console.log("Response data:", response.data);
          const base64Image = `data:image/png;base64,${base64.fromByteArray(new Uint8Array(response.data))}`;
          setImage(base64Image);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Handle 404 error gracefully
          console.log("Image not found (404)");
          setImage(null); // Set image to null
        } else {
          console.error("Error fetching picture:", error.message);
          console.log(error.response); // Log the entire response for more details
          // Handle other non-404 errors if needed
        }
      }
    };

      getImage();
  }, [userData]);

  const calculateStatusColor = (debtor) => {
    const status = debtor.status;
  
    if(status === "Not Due"){
      setColor("black");
      setOverdue(false);
    }else if(status === "Due"){
      setColor("blue");
      setOverdue(false);
    }else if(status === "Due Today"){
      setColor("orange");
      setOverdue(false);
    }else if(status === "Overdue"){
      setColor("red");
      setOverdue(true);
    }
  }
  
  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserHeader />
      <View style={styles.details}>
        <View style={styles.logo}>
        {image !== null ? (
              <Image
                source={{ uri: image }}
                style={{ width: 80, height: 80, borderRadius: 100 }}
              />
            ) : (
              <FontAwesome name="user" size={84} color="black" />
            )}
          
        </View>
        {userData ? (
          <View style={styles.info}>
            <Text>Name: {userData.name}</Text>
            <Text>Balance: ₱{totalAmount.toFixed(2)}</Text>
            <Text>Due Date: {debtor.due_date}</Text>
            <Text >Status: <Text style={{color:color, fontWeight:'bold'}}>{debtor.status}</Text></Text>
          </View>
        ) : (
          <Text>Error fetching user data</Text>
        )}
      </View>
      <ScrollView style={{ maxHeight: 300 }}>
        <DataTable style={styles.table}>
          {uthangsData?.length > 0 ? (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Qty.</DataTable.Title>
                <DataTable.Title>Item</DataTable.Title>
                <DataTable.Title>Price</DataTable.Title>
                <DataTable.Title>Total</DataTable.Title>
                <DataTable.Title>Date</DataTable.Title>
              </DataTable.Header>
              {uthangsData.map((item) => (
                <TouchableHighlight
                  key={item.u_id}
                  onPress={() => {
                    setSelectedUthang(item);
                    setModalVisible(true);
                  }}
                  underlayColor="#DDDDDD"
                >
                  <DataTable.Row>
                    <DataTable.Cell>{item.quantity}</DataTable.Cell>
                    <DataTable.Cell>{item.item_name}</DataTable.Cell>
                    <DataTable.Cell>₱{item.price}</DataTable.Cell>
                    <DataTable.Cell>₱{item.total}</DataTable.Cell>
                    <DataTable.Cell>{item.date}</DataTable.Cell>
                  </DataTable.Row>
                </TouchableHighlight>
              ))}

              {overDue && (
                <DataTable.Row>
                  <DataTable.Cell></DataTable.Cell>
                  <DataTable.Cell></DataTable.Cell>
                  <DataTable.Cell>
                  <Text style={styles.tableTitle}>Overdue Fee:</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                  <Text style={styles.tableTitle}> ₱{interestFee.toFixed(2)}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell></DataTable.Cell>
                </DataTable.Row>
              )}
              <DataTable.Row>
                <DataTable.Cell></DataTable.Cell>
                <DataTable.Cell></DataTable.Cell>
                <DataTable.Cell>
                <Text style={styles.tableTitle}>Balance Total:</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                <Text style={styles.tableTitle}> ₱{totalAmount.toFixed(2)}</Text>
                </DataTable.Cell>
                <DataTable.Cell></DataTable.Cell>
              </DataTable.Row>

              

            </DataTable>
          ) : (
            <Text style={styles.noUthangsText}>NO UTHANGS TO SHOW</Text>
          )}
        </DataTable>
      </ScrollView>
    </View>
  );
  }
export default UserMainPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#BAE8E8",
    flex: 1

  },

  details: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    marginRight: 20,
    marginLeft: 20,
    shadowOpacity: 80,
    elevation: 15,

  
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
    width: "100%",
    alignSelf: "center",
    shadowOpacity: 80,
    elevation: 15,
  },
  tableCell: {
    flex: 1,
  },
  dateCell: {
    flex: 2,
  },
  tableDebt: {
    flex: 1,
    width: "100%",
    padding: 5,
    backgroundColor: "white",
    width: 345,
    borderRadius: 15,
    marginTop: 10,
  },
  tableTitle: {
    fontWeight: "bold",
  },
  noUthangsText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});
