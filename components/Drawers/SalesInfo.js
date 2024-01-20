
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SalesInfoModal = ({ isVisible, onCancel, saleDetails }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => onCancel()}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Sale Details</Text>
          {saleDetails && (
            <>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailLabel}>Id:</Text>
                <Text style={styles.detailValue}>{saleDetails.sale_id}</Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailLabel}>Item:</Text>
                <Text style={styles.detailValue}>{saleDetails.item_name}</Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailLabel}>Quantity:</Text>
                <Text style={styles.detailValue}>{saleDetails.quantity_sold}</Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailLabel}>Price:</Text>
                <Text style={styles.detailValue}>₱{saleDetails.price}</Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailLabel}>Debtor:</Text>
                <Text style={styles.detailValue}>{saleDetails.debtor_name}</Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>{saleDetails.sale_date}</Text>
              </View>
            </>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => onCancel()}>
              <Text style={styles.buttonText}>Close</Text>
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
    width: '80%', // Adjust the width of the modal content
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align the button to the right
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SalesInfoModal;
