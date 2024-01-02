import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, ToastAndroid } from 'react-native';

const EnterModal = ({ isVisible, onConfirm, onCancel, onAmountEntered, payment, balance}) => {
  const [localPayment, setLocalPayment] = React.useState(0);

  const handlePaymentChange = (text) => {
    const numericValue = text.replace(/[^0-9.]/g, ''); // Allow digits and a dot for decimals
    setLocalPayment(numericValue);
  };


  const showToast = (message = "Something wen't wrong") => {
    ToastAndroid.show(message, 3000);
  };

  const handleConfirm = () => {
    if (localPayment === 0) {
      showToast("Please input required data");
      return false;
    }else if(localPayment > balance) {
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
          <Text style={styles.modalText}>Enter Amount</Text>

          <View style={styles.payFieldContainer}>
        <Text style={styles.pesoSign}>₱</Text>
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
            <TouchableOpacity style={styles.button} onPress={handleConfirm}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => onCancel()}>
              <Text style={styles.buttonText}>Cancel</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  payFieldContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  pesoSign: {
    marginTop: 6,
  },
});

export default EnterModal;
