import React, { useState, useEffect, useCallback, useFocusEffect } from "react";
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Alert, StyleSheet, View, Text, TouchableOpacity, TouchableHighlight, BackHandler, TextInput, ScrollView, Modal } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { EvilIcons } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import API_URL from "../services/apiurl";
import { ToastAndroid } from "react-native";
import ConfirmationModal from './Confirmation';
import EnterModal from './EnterAmount';
import ConfirmModal from './Confirm';

const ClickforMoreDetails = ({ route, navigation }) => {
  const { debtorInfo } = route.params;
  const [loading, setLoading] = React.useState(false);
  const [uthangsData, setUthangsData] = useState([]);
  const [payment, setPayment] =  React.useState(0.00);
  const [modalVisible, setModalVisible] = useState(false);
  const [entermodalVisible, setEnterModalVisible] = useState(false);
  const [paymodalVisible, setPayModalVisible] = useState(false);
  const [selectedUthang, setSelectedUthang] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [con, setCon] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const [isError, setIsError] = React.useState(false);
  

  const full = async () => {
    const paymentNumber = parseFloat(payment);
    const balanceNumber = parseFloat(balance);
    if(payment === 0){
      setPayment(String(balance));
    }else if(payment != balance){
      setPayment(String(balance));
    }else{
      console.log("Is payment = balance",paymentNumber === balance);
      await setCon(true)
      
    }
  }

  const partial = async () => {
    if(payment === 0){
    setEnterModalVisible(true)
  }else{
    await setCon(true)
  }
  }

  const confirmed = async () =>{
    setCon(false)

    const paymentNumber = parseFloat(payment);
    const balanceNumber = parseFloat(balance);

    if(paymentNumber === balanceNumber){
      await updateDataAmount(debtorInfo.d_id, 0);
      await deleteUtangs(debtorInfo.d_id);
    }else{
      await handlePay();
      setReloadData(true);
    }
  }

  useEffect(() => {
    if (reloadData) {
      fetchData();
      setReloadData(false);
    }
  }, [reloadData, fetchData]);



  const fetchData = useCallback(() => {
    if (debtorInfo.d_id) {
      axios
        .get(API_URL + 'uthangs/' + debtorInfo.d_id)
        .then((response) => {
          setUthangsData(response.data);
          checkBalance(balance);
        })
        .catch((error) => {
          console.error('Error fetching uthangs data:', error);
        });
    }
  }, [debtorInfo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isFocused = useIsFocused();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.navigate("ClickforMoreDetails", { debtorInfo });
        return true;
      }
    );

    return () => backHandler.remove();
  }, [isFocused]);

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      fetchData();
    });

    return () => {
      focusListener();
    };
  }, [navigation, fetchData]);

  const grandTotal = uthangsData
    .filter(item => typeof item.total === 'number' || (typeof item.total === 'string' && item.total.trim() !== ''))
    .reduce((sum, item) => sum + parseFloat(item.total), 0);
  
  const balance = grandTotal - debtorInfo.data_amount;
  
  const payAmount = (balance) => {
    if (selectedUthang.total > balance) {
      Alert.alert('Payment exceeded the current balance. Please use the Partial or Full Payment option.');
      setLoading(false);  // Make sure to set loading to false
      return;
    }else{
      setIsModalVisible(true)
    }
  }

  const handleConfirm = async () => {
    setIsModalVisible(false);
    setLoading(true);
      try {

        const url = API_URL + 'payutang/' + selectedUthang.u_id;
        const response = await axios.delete(url);
    
        console.log("Response data:", response.data);
        if (response.status === 200 || response.status === 204) {
          // Handle success
          console.log("Uthang paid successfully");
          setModalVisible(!modalVisible)
          ToastAndroid.show("Uthang paid successfully", ToastAndroid.SHORT);
          setReloadData(true);
        } else if (response.status === 404) {
          // Handle case where the resource was not found (deleted successfully but 404 status)
          console.log("Uthang not found (deleted successfully)");
          navigation.navigate("ClickforMoreDetails", { debtorInfo });
          ToastAndroid.show("Uthang not found (deleted successfully)", ToastAndroid.SHORT);
        } else {
          // Handle other cases where the API response does not indicate success
          console.error(
            "Uthang operation failed:",
            response.data.message || "Unknown error"
          );
          ToastAndroid.show("Uthang operation failed", ToastAndroid.SHORT);
        }
      } catch (error) {
        // Handle network error or other exceptions
        console.error("Error deleting uthang:", error.message);
        ToastAndroid.show("Error deleting uthang", ToastAndroid.SHORT);
      }finally{
        setLoading(false);
      }
    };

    
    


    const showToast = (message = "Something wen't wrong") => {
      ToastAndroid.show(message, 3000);
    };

    const updateDataAmount = async () => {
      setLoading(true);
      try {
        const defaultValue = 0.00;
    
        const url = API_URL + 'updatedataamount/' + debtorInfo.d_id;
        const data = {
          data_amount: defaultValue
        };
    
        const response = await axios.put(url, data);
    
        if (response.status === 200 || response.status === 204) {
          console.log('Data amount updated successfully');
          setReloadData(true);
          setPayModalVisible(!paymodalVisible);
          setPayment(0);
        } else {
          console.error('Error updating data amount:', response.data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error updating data amount:', error.message);
      }finally {
        setLoading(false);
    }
    };
    
    
    const deleteUtangs = async () => {
      setLoading(true);
      try {
        const url = API_URL + 'deleteutangs/' + debtorInfo.d_id;
        const response = await axios.delete(url);
    
        if (response.status === 200 || response.status === 204) {
          console.log('Utangs paid successfully');
          setReloadData(true);
          setPayModalVisible(!paymodalVisible);
        } else {
          console.error('Error deleting utangs:', response.data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error deleting utangs:', error.message);
      }finally {
        setLoading(false);
    }
    };
    

    const handlePay = async () => {
      setLoading(true);
      let isFullPayment = false;
      try {
        if (payment === 0 || payment > balance) {
          Alert.alert('Error', 'Invalid payment amount. Please enter a valid Amount.');
          return;
        }
    
        const parsedPayment = parseFloat(payment);
        const newBalance = balance - parsedPayment;
        console.log('Parsed Payment:', parsedPayment);
    
        const response = await fetch(API_URL + 'datapayment/' + debtorInfo.d_id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data_amount: parsedPayment,
          }),
        });
    
        const responseData = await response.json();
        console.log(responseData);
    
        if (response.ok) {
          setPayModalVisible(!paymodalVisible);
          ToastAndroid.show('Payment Successful', ToastAndroid.SHORT);
    
          if (newBalance === 0) {
            await updateDataAmount(debtorInfo.d_id, 0);
            await deleteUtangs(debtorInfo.d_id);
            isFullPayment = true;
          }
        } else {
          // Log the error to the console
          console.error('Error during payment:', responseData.error || 'An error occurred');
    
          // Handle errors, e.g., show an error message
          Alert.alert('Error', responseData.error || 'An error occurred');
        }
      } catch (error) {
        console.error('Error during payment:', error);
        // Handle other errors if needed
        Alert.alert('Error', 'An unexpected error occurred');
      } finally {
        setLoading(false);
        if (isFullPayment) {
          setReloadData(true);
        } else {
          fetchData(); // Reload data for partial payment
        }
      }
    };
    
        
    
    

      const handleCancel = () => {
        // Handle the "No" button click
        setIsModalVisible(false);
        setEnterModalVisible(false);
        setCon(false);
        setIsConfirmed(false);
      };

      const checkBalance = async (balance) =>{
        try{
          if(uthangsData.length > 0){
            if(balance <= 0){
              const newDataAmount = 0.00
            const response = await axios.post(
              API_URL + 'checkbalance/' + debtorInfo.d_id,
              newDataAmount 
            );
        
            if (response.status === 200) {
              console.log('Check successful');
              // Handle success
            } else {
              console.error('Check failed:', response.data.error || 'Unknown error');
              // Handle failure
            }
          } 
             
          }
        }catch (error) {
          console.error('Error during checkBalance:', error.message || 'Unknown error');
          }
      }


  const renderModalContent = () => {
    if (!selectedUthang) {
      return null;
    }

    return (
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>
        <Text style={styles.modalTitle}>Debt Details</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Item:</Text>
          <Text style={styles.detailValue}>{selectedUthang.item_name}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Quantity:</Text>
          <Text style={styles.detailValue}>{selectedUthang.quantity}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Price:</Text>
          <Text style={styles.detailValue}>₱{selectedUthang.price}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Total:</Text>
          <Text style={styles.detailValue}>₱{selectedUthang.total}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{selectedUthang.date}</Text>
        </View>
        <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.payButton, { marginRight: 10 }]}
          onPress={() => {
            payAmount(balance);
          }}
        >
          <Text style={styles.buttonText}>Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("ViewDebtRecord", {
              selectedUthang, debtorInfo 
            })
          }
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PayModalContent = ({ setPayModalVisible }) => {
  return (
    <View style={styles.modalContent}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setPayModalVisible(false)}
      >
        <Text style={styles.buttonText}>X</Text>
      </TouchableOpacity>
      <Text style={styles.modalTitle}>Payment</Text>
      <View style={styles.paydetailsContainer}>
        <Text style={styles.paydetailLabel}>Total Utang:</Text>
        <Text style={styles.paydetailValue}>₱{grandTotal}.00</Text>
      </View>
      <View style={styles.paydetailsContainer}>
        <Text style={styles.paydetailLabel}>Data Payment:</Text>
        <Text style={styles.paydetailValue}>₱{debtorInfo.data_amount}</Text>
      </View>
      <View style={styles.paydetailsContainer}>
        <Text style={styles.paydetailLabel}>Last Payment:</Text>
        <Text style={styles.paydetailValue}>{debtorInfo.last_payment_date}</Text>
      </View>
      <View style={styles.paydetailsContainer}>
        <Text style={styles.paydetailLabel}>Balance:</Text>
        <Text style={styles.paydetailValue}>₱{balance}</Text>
      </View>
      <Text style={styles.payTitle}>Amount</Text>
      
        <View style={styles.payFieldContainer}>
          <TouchableOpacity onPress={() => setEnterModalVisible(true)}>
            <Text style={styles.pesoSign}>          ₱{payment}.00</Text>
          </TouchableOpacity>
          
            <View style={styles.resetButtonContainer}>    
            <TouchableOpacity onPress={() => setPayment(0)} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      <View style={styles.buttonsContainer}>
      <TouchableOpacity
        style={[styles.payButton, { marginRight: 10 }]}
        disabled={loading}
        loading={loading}
        onPress={() => {full()
        }}
      >
          <Text style={styles.buttonText}>Pay Full</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.editButton}
          disabled={loading}
          loading={loading}
          onPress={() => partial()}
        >
          <Text style={styles.buttonText}>Partial Pay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};




  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
  >
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.displayPicture}>
              <EvilIcons name="user" size={256} color="black" />
            </View>
            <View style={styles.details}>
              <Text>Name: {debtorInfo.d_name}</Text>
              <Text>Phone: {debtorInfo.phone}</Text>
              <Text>Address: {debtorInfo.address}</Text>
              <Text>Email: {debtorInfo.email}</Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 15, gap: 5 }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("ViewTransaction", { debtorInfo })}
              >
                <Text style={styles.buttonText}>Transactions</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("EditProfile", { debtorInfo })}
              >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tableDebt}>
            {uthangsData?.length > 0 ? (
              
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Item</DataTable.Title>
                  <DataTable.Title>Quantity</DataTable.Title>
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
                      <DataTable.Cell>{item.item_name}</DataTable.Cell>
                      <DataTable.Cell>{item.quantity}</DataTable.Cell>
                      <DataTable.Cell>₱{item.price}</DataTable.Cell>
                      <DataTable.Cell>₱{item.total}</DataTable.Cell>
                      <DataTable.Cell>{item.date}</DataTable.Cell>
                    </DataTable.Row>
                  </TouchableHighlight>
                ))}
                <DataTable.Row>
                  <DataTable.Cell></DataTable.Cell>
                  <DataTable.Cell></DataTable.Cell>
                  <DataTable.Cell>
                  <TouchableOpacity
                      style={styles.pbutton}
                      onPress={() => {
                        setPayModalVisible(true);
                      }}
                      underlayColor="#DDDDDD"
                    >
                      <Text style={styles.buttonText}>Pay</Text>
                    </TouchableOpacity>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={styles.tableTitle}>Balance Total:</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={styles.tableTitle}> ₱{balance}.00</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              </DataTable>
            ) : (
              <Text style={styles.noUthangsText}>NO UTHANGS TO SHOW</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("AddUtang", { debtorInfo })}>
            <AntDesign
              style={styles.plusButton}
              name="pluscircle"
              size={58}
              color="black"
            />
          </TouchableOpacity>



          <Modal
            animationType="slide"
            transparent={true}
            visible={paymodalVisible}
            onRequestClose={() => setPayModalVisible(!paymodalVisible)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <PayModalContent setPayModalVisible={setPayModalVisible} />
              </View>
            </View>
          </Modal>



          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {renderModalContent()}
              </View>
            </View>
          </Modal>
          
          <ConfirmationModal
          isVisible={isModalVisible}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          />
          <ConfirmModal
            isVisible={con}
            onConfirm={confirmed}
            onCancel={handleCancel}
          />
          <EnterModal
        isVisible={entermodalVisible}
        onConfirm={() => {
          // Handle the confirmation logic if needed
          setEnterModalVisible(false);
        }}
        onCancel={() => setEnterModalVisible(false)}
        onAmountEntered={(enteredPayment) => setPayment(enteredPayment)}
        payment={payment}  // Pass the payment as a prop
        balance={balance}
      />

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ClickforMoreDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#BAE8E8",
  },
  contentContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 30,
    marginTop: 10,
  },
  displayPicture: {},
  details: {
    marginTop: 20,
    gap: 10,
  },
  tableDebt: {
    padding: 5,
    backgroundColor: "white",
    width: 370,
    borderRadius: 30,
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
  plusButton: {
    margin: 20,
    marginTop: 20,
    bottom: "1%",
  },
  button: {
    backgroundColor: "#FFD803",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  pbutton: {
    backgroundColor: "green",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  detailLabel: {
    flexBasis: '30%',
    fontWeight: 'bold',
    marginRight: 10,
    textAlign: 'right',
  },
  detailValue: {
    flex: 1,
  },
  payTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 20,
  },
  paydetailsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  paydetailLabel: {
    flexBasis: '40%',
    fontWeight: 'bold',
    marginRight: 10,
    textAlign: 'right',
  },
  paydetailValue: {
    flex: 1,
  },
  closeButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    left: 100,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  payFieldContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  pesoSign: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: 'green',
    borderRadius: 10,
    paddingVertical: 12,
    flex: 1,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: 'orange',
    borderRadius: 10,
    paddingVertical: 12,
    flex: 1,
    alignItems: 'center',
  },
  paymentinput: {
    height: 30,
    borderBottomColor: 'blue',
    borderBottomWidth: 1,    
    marginBottom: 10,           
  },
  resetButtonContainer: {
    marginLeft: 'auto', // This will push the reset button to the right
    alignSelf: 'center', // Align the button vertically in the center
  },
  resetButton: {
    marginLeft: 10, // Add some space between the amount and the reset button
    color: 'blue', // Customize the color as needed
  },

  
});
