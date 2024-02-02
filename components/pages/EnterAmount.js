import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ToastAndroid,
} from "react-native";
import { Button, Text } from "react-native-paper";

const EnterModal = ({
  isVisible,
  onConfirm,
  onCancel,
  onAmountEntered,
  payment,
  balance,
}) => {
  const [localPayment, setLocalPayment] = React.useState(0);

  const handlePaymentChange = (text) => {
    const numericValue = text.replace(/[^0-9.]/g, "");
    setLocalPayment(numericValue);
  };

  const showToast = (message = "Something wen't wrong") => {
    ToastAndroid.show(message, 3000);
  };

  const handleConfirm = () => {
    if (localPayment === 0) {
      showToast("Please input required data");
      return false;
    } else if (localPayment > balance) {
      showToast("Please input valid amount");
      return false;
    }
    // Invoke the callback with the entered payment amount
    onAmountEntered(localPayment);
    // Call the original onConfirm callback if needed
    onConfirm();
  };

  React.useEffect(() => {
    // Update the localPayment state when the payment prop changes
    setLocalPayment(payment);
  }, [payment]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => onCancel()}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text variant="titleLarge">Enter Amount</Text>

          <View style={styles.payFieldContainer}>
            <Text variant="titleLarge" style={styles.pesoSign}>
              ₱
            </Text>
            <TextInput
              style={styles.paymentinput}
              placeholder="Enter Payment Amount: "
              keyboardType="numeric"
              value={localPayment.toString()}
              onChangeText={handlePaymentChange}
              editable={true}
              selectTextOnFocus={true}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => onCancel()}>
              <Button>
                <Text style={styles.buttonText}>Cancel</Text>
              </Button>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonConfirm}
              onPress={handleConfirm}
            >
              <Button>
                <Text variant="bodyMedium" style={styles.buttonText}>
                  Confirm
                </Text>
              </Button>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#FFD803",
  },
  buttonConfirm: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "green",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  payFieldContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  pesoSign: {},
});

export default EnterModal;
