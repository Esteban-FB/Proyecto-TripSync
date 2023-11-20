// ModalDetalle.js
import React from 'react';
import { View, Text, Modal, Button } from 'react-native';

const ModalDetalle = ({ local, closeModal }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true} // Puedes pasar esta prop desde el componente padre
      onRequestClose={closeModal}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 300, height: 300, backgroundColor: 'white', padding: 20 }}>
          <Text>{local.nombreSitio}</Text>
          <Text>Detalles del local: {local.nombreSitio}</Text>
          {/* Agrega más detalles según tu modelo */}
          <Button title="Cerrar" onPress={closeModal} />
        </View>
      </View>
    </Modal>
  );
};

export default ModalDetalle;
