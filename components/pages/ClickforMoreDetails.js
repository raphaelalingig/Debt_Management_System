import React, { useState, useEffect, useCallback, useFocusEffect } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight,
  BackHandler,
  TextInput,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { EvilIcons } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import API_URL from "../services/apiurl";
import { ToastAndroid } from "react-native";
import ConfirmationModal from "./Confirmation";
import EnterModal from "./EnterAmount";
import ConfirmModal from "./Confirm";
import { Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import base64 from "base64-js";

const ClickforMoreDetails = ({ route }) => {
  const navigation = useNavigation();
  const { debtorInfo } = route.params;
  const [debtor, setDebtor] = useState([]);
  const [color, setColor] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [uthangsData, setUthangsData] = useState([]);
  const [payment, setPayment] = React.useState(0.0);
  const [modalVisible, setModalVisible] = useState(false);
  const [entermodalVisible, setEnterModalVisible] = useState(false);
  const [paymodalVisible, setPayModalVisible] = useState(false);
  const [selectedUthang, setSelectedUthang] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [con, setCon] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const [isError, setIsError] = React.useState(false);
  const [due_fee, setDue_fee] = useState(0);
  const [interestFee, setInterestFee] = useState(0.00);
  const [totalAmount, setTotalAmount] = useState(0.00);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (reloadData) {
      fetchData();
      setReloadData(false);
    }
  }, [reloadData, fetchData]);

  useEffect(() => {
    const getImage = async () => {
      try {
        const response = await axios.get(
          API_URL + "getImage/" + debtorInfo.d_id,
          {
            responseType: "arraybuffer",
          }
        );

        if (response.status !== 200) {
          console.error("Error fetching picture:", response.data.error);
          
        } else {
          console.log("Response data:", response.data);
          const base64Image = `data:image/png;base64,${base64.fromByteArray(
            new Uint8Array(response.data)
          )}`;
          setImage(base64Image);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          
          console.log("Image not found (404)");
          setImage(null); 
        } else {
          console.error("Error fetching picture:", error.message);
          console.log(error.response); 
        }
      }
    };

    getImage();
  }, [debtorInfo]);

  const fetchData = useCallback(() => {
    if (debtorInfo.d_id) {
      axios
          .get(API_URL + "debtor/" + debtorInfo.d_id)
          .then((response) => {
              const { debtor, totalAmount, interest } = response.data;
              setDebtor(debtor);
              setTotalAmount(totalAmount);
              setInterestFee(interest);
              calculateStatusColor(debtor);
          })
        .catch((error) => {
          console.error("Error fetching data:", error);
          console.error("Response data:", error.response.data);
        });
    }
    if (debtorInfo.d_id) {
      axios
        .get(API_URL + "uthangs/" + debtorInfo.d_id)
        .then((response) => {
          setUthangsData(response.data);
          checkBalance(totalAmount);
        })
        .catch((error) => {
          console.error("Error fetching uthangs data:", error);
        });
    }
  }, [debtorInfo]);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, fetchData]);

  const isFocused = useIsFocused();

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     () => {
  //       navigation.navigate("ClickforMoreDetails", { debtorInfo });
  //       return true;
  //     }
  //   );

  //   return () => backHandler.remove();
  // }, [isFocused]);

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      fetchData();
    });

    return () => {
      focusListener();
    };
  }, [navigation, fetchData]);

  const full = async () => {
    const paymentNumber = parseFloat(payment);
    const totalAmountNumber = parseFloat(totalAmount);
    if (payment === 0) {
      setPayment(String(totalAmount));
    } else if (payment != totalAmount) {
      setPayment(String(totalAmount));
    } else {
      console.log("Is payment = balance", paymentNumber === totalAmount);
      await setCon(true);
    }
  };

  const partial = async () => {
    if (payment === 0) {
      setEnterModalVisible(true);
    } else {
      await setCon(true);
    }
  };

  const confirmed = async () => {
    setCon(false);

    const paymentNumber = parseFloat(payment);
    const totalAmountNumber = parseFloat(totalAmount);

    if (paymentNumber === totalAmountNumber) {
      await updateDataAmount(debtorInfo.d_id, 0);
      await deleteUtangs(debtorInfo.d_id);
    } else {
      await handlePay();
      setReloadData(true);
    }
  };

  const grandTotal = uthangsData
    .filter(
      (item) =>
        typeof item.total === "number" ||
        (typeof item.total === "string" && item.total.trim() !== "")
    )
    .reduce((sum, item) => sum + parseFloat(item.total), 0);



  const interest = grandTotal * due_fee + grandTotal;
  const percent = interest - grandTotal;
  const balance = interest - debtor.data_amount;



  const payAmount = (totalAmount) => {
    if (selectedUthang.total > totalAmount) {
      Alert.alert(
        "Payment exceeded the current balance. Please use the Partial or Full Payment option."
      );
      setLoading(false);
      return;
    } else {
      setIsModalVisible(true);
    }
  };

  const handleConfirm = async () => {
    setIsModalVisible(false);
    setLoading(true);
    try {
      const url = API_URL + "payutang/" + selectedUthang.u_id;
      const response = await axios.delete(url);

      console.log("Response data:", response.data);
      if (response.status === 200 || response.status === 204) {
        
        console.log("Uthang paid successfully");
        setModalVisible(!modalVisible);
        ToastAndroid.show("Uthang paid successfully", ToastAndroid.SHORT);
        setReloadData(true);
      } else if (response.status === 404) {
        console.log("Uthang not found (deleted successfully)");
        navigation.navigate("ClickforMoreDetails", { debtorInfo });
        ToastAndroid.show(
          "Uthang not found (deleted successfully)",
          ToastAndroid.SHORT
        );
      } else {
        console.error(
          "Uthang operation failed:",
          response.data.message || "Unknown error"
        );
        ToastAndroid.show("Uthang operation failed", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error deleting uthang:", error.message);
      ToastAndroid.show("Error deleting uthang", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message = "Something wen't wrong") => {
    ToastAndroid.show(message, 3000);
  };

  const updateDataAmount = async () => {
    setLoading(true);
    try {
      const defaultValue = 0.0;

      const url = API_URL + "updatedataamount/" + debtorInfo.d_id;
      const data = {
        data_amount: defaultValue,
      };

      const response = await axios.put(url, data);

      if (response.status === 200 || response.status === 204) {
        console.log("Data amount updated successfully");
        setReloadData(true);
        setPayModalVisible(!paymodalVisible);
        setPayment(0);
      } else {
        console.error(
          "Error updating data amount:",
          response.data.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error updating data amount:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUtangs = async () => {
    setLoading(true);
    try {
      const url = API_URL + "deleteutangs/" + debtorInfo.d_id;

      const parsedPayment = parseFloat(payment);
      const data_amount = parsedPayment; 

      const response = await axios.delete(url, {
        data: { data_amount },
      });
      if (response.status === 200 || response.status === 204) {
        console.log("Utangs paid successfully");
        setReloadData(true);
        setPayModalVisible(!paymodalVisible);
        setPayment(0);
      } else {
        console.error(
          "Error deleting utangs:",
          response.data.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error deleting utangs:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    setLoading(true);
    let isFullPayment = false;
    try {
      if (payment === 0 || payment > totalAmount) {
        Alert.alert(
          "Error",
          "Invalid payment amount. Please enter a valid Amount."
        );
        return;
      }

      const parsedPayment = parseFloat(payment);
      const newBalance = totalAmount - parsedPayment;
      console.log("Parsed Payment:", parsedPayment);

      const response = await fetch(API_URL + "datapayment/" + debtorInfo.d_id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data_amount: parsedPayment,
        }),
      });

      const responseData = await response.json();
      console.log(responseData);

      if (response.status === 200 || response.status === 204) {
        console.log("Payment Successful");
        setReloadData(true);
        setPayModalVisible(!paymodalVisible);
        setPayment(0);
        ToastAndroid.show("Payment Successful", ToastAndroid.SHORT);

        if (newBalance === 0) {
          await updateDataAmount(debtorInfo.d_id, 0);
          await deleteUtangs(debtorInfo.d_id);
          isFullPayment = true;
        }
      } else {
   
        console.error(
          "Error during payment:",
          responseData.error || "An error occurred"
        );


        Alert.alert("Error", responseData.error || "An error occurred");
      }
    } catch (error) {
      console.error("Error during payment:", error);

      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
      if (isFullPayment) {
        setReloadData(true);
      } else {
        fetchData();
      }
    }
  };

  const handleCancel = () => {

    setIsModalVisible(false);
    setEnterModalVisible(false);
    setCon(false);
    setIsConfirmed(false);
  };

  const checkBalance = async (totalAmount) => {
    try {
      if (uthangsData.length > 0) {
        if (totalAmount <= 0) {
          const newDataAmount = 0.0;
          const response = await axios.post(
            API_URL + "checkbalance/" + debtorInfo.d_id,
            newDataAmount
          );

          if (response.status === 200) {
            console.log("Check successful");

          } else {
            console.error(
              "Check failed:",
              response.data.error || "Unknown error"
            );
          
          }
        }
      }
    } catch (error) {
      console.error(
        "Error during checkBalance:",
        error.message || "Unknown error"
      );
    }
  };

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
          <AntDesign name="closecircle" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Utang Details</Text>
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
              payAmount(totalAmount);
            }}
          >
            <Text style={styles.buttonText}>Pay</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              try {
                setModalVisible(false);
                navigation.navigate("ViewDebtRecord", {
                  selectedUthang,
                  debtorInfo,
                });
              } catch (error) {
                console.error("Error navigating:", error);
              }
            }}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // DARI ANG SA PAYMENT NGA BOX
  const PayModalContent = ({ setPayModalVisible }) => {
    return (
      <View style={styles.modalContent1}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setPayModalVisible(false)}
        >
          <AntDesign name="closecircle" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Payment</Text>
        <View style={styles.paydetailsContainer}>
          <Text style={styles.paydetailLabel}>Total Utang:</Text>
          <Text style={styles.paydetailValue}>₱{grandTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.paydetailsContainer}>
          <Text style={styles.paydetailLabel}>Overdue Fee:</Text>
          <Text style={styles.paydetailValue}>₱{parseFloat(interestFee).toFixed(2)}</Text>
        </View>
        <View style={styles.paydetailsContainer}>
          <Text style={styles.paydetailLabel}>Data Payment:</Text>
          <Text style={styles.paydetailValue}>₱{debtor.data_amount}</Text>
        </View>
        <View style={styles.paydetailsContainer}>
          <Text style={styles.paydetailLabel}>Last Payment:</Text>
          <Text style={styles.paydetailValue}>{debtor.last_payment_date}</Text>
        </View>
        <View style={styles.paydetailsContainer}>
          <Text style={styles.paydetailLabel}>Balance:</Text>
          <Text style={styles.paydetailValue}>₱{totalAmount.toFixed(2)}</Text>
        </View>
        <Text style={styles.payTitle}>Amount</Text>

        <View style={styles.payFieldContainer}>
          <TouchableOpacity onPress={() => setEnterModalVisible(true)}>
            <Text style={styles.pesoSign}> ₱{payment}</Text>
          </TouchableOpacity>

          <View style={styles.resetButtonContainer}>
            <TouchableOpacity
              onPress={() => setPayment(0)}
              style={styles.resetButton}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.payButton, { marginRight: 10 }]}
            disabled={loading}
            loading={loading}
            onPress={() => {
              full();
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
  const calculateStatusColor = (debtor) => {
    const status = debtor.status;

    if (status === "Not Due") {
      setColor("black");
    } else if (status === "Due") {
      setColor("blue");
    } else if (status === "Due Today") {
      setColor("orange");
    } else if (status === "Overdue") {
      setColor("red");
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.navigate("MainPage");
        return true;
      }
    );

    return () => backHandler.remove();
  }, [isFocused]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={{ backgroundColor: "#BAE8E8" }}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.displayPicture}>
              {image !== null ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: 200, height: 200, borderRadius: 100 }}
                />
              ) : (
                <EvilIcons name="user" size={230} color="black" />
              )}
            </View>

            <View style={styles.details}>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Name: </Text>
                {debtorInfo.d_name}
              </Text>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Phone: </Text>
                {debtorInfo.phone}
              </Text>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Address: </Text>
                {debtorInfo.address}
              </Text>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Email: </Text>
                {debtorInfo.email}
              </Text>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Due Date: </Text>
                {debtor.due_date} /{" "}
                <Text style={{ color: color, fontWeight: "bold" }}>
                  {debtor.status}
                </Text>
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 15, gap: 5 }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("ViewTransaction", { debtorInfo })
                }
              >
                <Text variant="titleSmall" style={styles.buttonText}>
                  Transactions
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("EditProfile", { debtorInfo })
                }
              >
                <Text variant="titleSmall" style={styles.buttonText}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tableDebt}>
            {uthangsData?.length > 0 ? (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Item</DataTable.Title>
                  <DataTable.Title>Qty</DataTable.Title>
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
                      <Text style={{ color: "white" }}>Pay</Text>
                    </TouchableOpacity>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={styles.tableTitle}>Balance Total:</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={styles.tableTitle}>
                      {" "}
                      ₱{parseFloat(totalAmount).toFixed(2)}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              </DataTable>
            ) : (
              <Text style={styles.noUthangsText}>NO UTHANGS TO SHOW</Text>
            )}
          </View>

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
              <View style={styles.modalView1}>{renderModalContent()}</View>
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
              setEnterModalVisible(false);
            }}
            onCancel={() => setEnterModalVisible(false)}
            onAmountEntered={(enteredPayment) => setPayment(enteredPayment)}
            payment={payment} // Pass the payment as a prop
            totalAmount={totalAmount}
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.plusButtonContainer}
        onPress={() => navigation.navigate("AddUtang", { debtorInfo })}
      >
        <AntDesign
          name="pluscircle"
          size={58}
          color="black"
          style={styles.plusButton}
          onPress={() => navigation.navigate("AddUtang", { debtorInfo })}
        />
      </TouchableOpacity>
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
  displayPicture: {
    alignItems: "center",
  },
  details: {
    marginTop: 20,
    gap: 10,
  },
  tableDebt: {
    padding: 5,
    backgroundColor: "white",
    width: 345,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 100,
  },
  tableTitle: {
    fontWeight: "bold",
  },
  noUthangsText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  plusButtonContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },

  plusButton: {
    alignSelf: "center",
    margin: 10,
    position: "relative",
    elevation: 10,
    borderRadius: 150,
  },

  plusButtontBG: {
    backgroundColor: "#BAE8E8",
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
  modalView1: {
    flex: 1,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    marginBottom: 220,
    marginTop: 150,
  },

  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    marginBottom: 120,
    marginTop: 150,
  },

  modalContent: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },

  modalContent1: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 50,
    marginBottom: 10,
    alignItems: "center",
  },
  detailLabel: {
    flexBasis: "30%",
    fontWeight: "bold",
    marginRight: 10,
    textAlign: "right",
  },
  detailValue: {
    flex: 1,
  },
  payTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 20,
  },
  paydetailsContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  paydetailLabel: {
    flexBasis: "40%",
    fontWeight: "bold",
    marginRight: 10,
    textAlign: "right",
  },
  paydetailValue: {
    flex: 1,
  },
  closeButton: {
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    left: 130,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  payFieldContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  pesoSign: {
    fontSize: 15,
    fontWeight: "bold",
  },
  payButton: {
    backgroundColor: "green",
    borderRadius: 10,
    paddingVertical: 12,
    flex: 1,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "orange",
    borderRadius: 10,
    paddingVertical: 12,
    flex: 1,
    alignItems: "center",
  },
  paymentinput: {
    height: 30,
    borderBottomColor: "blue",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  resetButtonContainer: {
    marginLeft: "auto",
    alignSelf: "center",
  },
  resetButton: {
    marginLeft: 10,
    color: "blue",
  },
});
