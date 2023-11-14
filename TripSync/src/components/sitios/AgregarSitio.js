import * as React from 'react';
import { View, Text, Button, Modal, Pressable } from 'react-native';
import RegistrarSitio from './RegistrarSitio';
import { useNavigation } from '@react-navigation/native';

const AgregarSitio = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleRegistroClick = () => {
    // Abre el modal cuando se presiona el botón
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        No tienes ningún sitio registrado
      </Text>
      <Button
        title="Registrar un sitio"
        onPress={handleRegistroClick}
      />

      {/* Modal para registrar/editar sitios */}
      <RegistrarSitio
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        modoEdicion={false} // Puedes cambiar a true si estás editando un sitio existente
      />
    </View>
  );
};

export default AgregarSitio;
