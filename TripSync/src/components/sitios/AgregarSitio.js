import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, FlatList, Pressable } from 'react-native';
import RegistrarSitio from './RegistrarSitio';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../../utils/context/AuthContext'; // Ajusta la ruta según tu estructura de carpetas

const AgregarSitio = () => {
  const {user } = useAuth()
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [locales, setLocales] = useState([]);
  const [usuario, setUsuario] = useState(user.user); // Usuario actual, reemplázalo con tu lógica de autenticación
  const [modoEdicion, setModoEdicion] = useState(false);
  const [localSeleccionado, setLocalSeleccionado] = useState(null); 

  useEffect(() => {
    // Lógica para obtener los locales del usuario desde la base de datos
    const obtenerLocales = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:5000/api/locales/getLocalesByUser/${usuario}`);
        setLocales(response.data);
      } catch (error) {
        console.error('Error al obtener locales:', error);
      }
    };

    obtenerLocales();
  }, [usuario]);

  const handleRegistroClick = () => {
    setModoEdicion(false);
    // Abre el modal cuando se presiona el botón
    setModalVisible(true);

  };

  const handleEditarClick = (local) => {
    setModoEdicion(true)
    setLocalSeleccionado(local);
    // Abre el modal en modo edición con la información del local seleccionado
    setModalVisible(true);
    // Pasa la información del local al modal
    // Asegúrate de tener un estado en RegistrarSitio para cargar los datos del local en modo edición
    // Por ejemplo: <RegistrarSitio visible={modalVisible} onClose={() => setModalVisible(false)} local={local} />
    //setDatosDelSitio(local);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {locales.length === 0 ? (
        <Text style={{ fontSize: 20, marginBottom: 20 }}>
          No tienes ningún sitio registrado
        </Text>
      ) : (
        <FlatList
          data={locales}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text>{item.nombreSitio}</Text>
              <Button title="Editar" onPress={() => handleEditarClick(item)} />
            </View>
          )}
        />
      )}

      <Button
        title="Registrar un sitio"
        onPress={handleRegistroClick}
      />

      {/* Modal para registrar/editar sitios */}
      <RegistrarSitio
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        modoEdicion={modoEdicion}
        sitioAEditar={localSeleccionado} // Puedes cambiar a true si estás editando un sitio existente
      />
    </View>
  );
};

export default AgregarSitio;
