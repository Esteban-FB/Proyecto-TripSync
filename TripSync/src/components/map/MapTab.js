import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Modal, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import { useAuth } from '../../utils/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import ModalDetalle from '../locales/ModalDetalle'; 
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

const MapScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [locales, setLocales] = useState([]);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [detalleLocal, setDetalleLocal] = useState(null);
  const [detalleUsuarios, setDetalleUsuarios] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude:9.389269,
    longitude:-83.7069490,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [selectedLocal, setSelectedLocal] = useState(null);

  useEffect(() => {
    const askLocationPermission = async () => {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        try {
          let location = await Location.getCurrentPositionAsync({});
          if (location) {
            const { latitude, longitude } = location.coords;
            setInitialRegion({
              latitude,
              longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            });
          }
        } catch (error) {
          console.error('Error obteniendo la ubicación', error);
        }
      } else {
        // Permiso denegado, manejar esta situación
      }
    };

    askLocationPermission();
  }, []);
  useFocusEffect(
    useCallback(() => {
      const fetchLocalesFromDB = async () => {
        try {
          const response = await axios.get(`http://10.0.2.2:5000/api/locales/getLocalesCoinciden/${user.user}`);
          setLocales(response.data);
          
          if (response.data.length > 0) {
            const firstLocal = response.data[0];
            const latitude = parseFloat(firstLocal.Latitud);
            const longitude = parseFloat(firstLocal.Longitud);
            

          }

        } catch (error) {
          console.error('Error al obtener la lista de locales', error);
        }
      };

      if (user) {
        fetchLocalesFromDB();
      }
    }, [user, navigation])
  );

  const openModal = (local) => {
    setSelectedLocal(local);
  };

  const closeModal = () => {
    setSelectedLocal(null);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {locales.map((local, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(local.Latitud),
              longitude: parseFloat(local.Longitud),
            }}
            title={local.nombreSitio}
            onPress={() => {
              console.log("Este es el item a mostrar el detalle: ", local);
              
              setDetalleLocal(local);
              setDetalleUsuarios(local.reviews);
              setDetalleVisible(true);
            }}// Manejar el evento onPress del marcador
          />
        ))}
      </MapView>


      {detalleVisible && detalleLocal && detalleUsuarios && (
        <ModalDetalle
        
          local={detalleLocal}
          usuarios={detalleUsuarios}
          closeModal={() => setDetalleVisible(false)}
        />
      )}
      {/* Modal para mostrar detalles del local */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedLocal}
        onRequestClose={closeModal}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{selectedLocal?.nombreSitio}</Text>
            {/* Aquí puedes mostrar más detalles del local */}
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeButton}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalView: {
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    fontSize: 16,
    color: 'blue',
    marginTop: 10,
  },
});
