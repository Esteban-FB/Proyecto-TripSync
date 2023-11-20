import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TextInput, Image, TouchableOpacity, Modal, Button, StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';
import ModalDetalle from './ModalDetalle'; 
import axios from 'axios';
import { useAuth } from '../../utils/context/AuthContext'; // Suponiendo que aquí tienes el contexto con la información del usuario

const LocalList = () => {
  const {user } = useAuth(); // Obteniendo la información del usuario desde el contexto

  const [locales, setLocales] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [modalActividadesVisible, setModalActividadesVisible] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [nombreLocal, setNombreLocal]=useState('');

  useEffect(() => {
    if (user) {
      axios.get(`http://10.0.2.2:5000/api/locales/getLocalesCoinciden/${user.user}`)
        .then(response => {
          setLocales(response.data);
        })
        .catch(error => {
          console.error('Error al obtener la lista de locales', error);
        });
    }
  }, [user]);

  const dejarDeSeguirLocal = (localId) => {
    axios.post(`http://10.0.2.2:5000/api/locales/dejarDeSeguirLocal/${localId}`, { usuario: user.user })
      .then(response => {
        const nuevosLocales = locales.filter(local => local._id !== localId);
        setLocales(nuevosLocales);
      })
      .catch(error => {
        console.error('Error al dejar de seguir el local', error);
      });
  };

  const handleAgregarActividadEnOtroLugar = async (actividad, localNombre) => {
    const selectedDay = actividad.fecha; // Obtener la fecha de la actividad
    const newEventText = localNombre; // Nombre del Local del item que contiene las actividades
    const newEventDetails = actividad.nombre; // Nombre de la actividad
  
    try {
      // Enviar el evento al servidor usando Axios
      await axios.post('http://10.0.2.2:5000/api/agenda/agregar-evento', {
        date: selectedDay,
        text: newEventText,
        details: newEventDetails,
      });
  
      // Manejar la respuesta del servidor si es necesario
  
    } catch (error) {
      console.error('Error al enviar el evento al servidor:', error.message);
      // Puedes manejar el error según tus necesidades
    }
  };

  const ModalActividades = ({ actividades, nombreLocal }) => {
    return (
      <View style={styles.modalContainer}>
        <Text style={styles.actividadesHeaderText}>Actividades del lugar:</Text>
        {actividades &&
          actividades.map((actividad, index) => (
            <View key={index} style={styles.actividadContainer}>
              <Text style={styles.actividadNombre}>{actividad.nombre}</Text>
              <Text style={styles.actividadFecha}>{actividad.fecha}</Text>
              <TouchableOpacity
                style={styles.agregarButton}
                onPress={() => {
                  handleAgregarActividadEnOtroLugar(actividad, nombreLocal);
                }}
              >
                <Text style={styles.agregarButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          ))}
        <Button title="Cerrar" onPress={() => setModalActividadesVisible(false)} />
      </View>
    );
  };  

  const renderItem = ({ item }) => (
    <View style={styles.localContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.foto }} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.nombre}>{item.nombreSitio}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Rating
            type="star"
            startingValue={item.calificacionPromedio}
            imageSize={20}
            showRating={false}
            onFinishRating={() => {}}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => dejarDeSeguirLocal(item._id)}>
          <Text>Siguiendo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text>Detalles</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {
            setActividadSeleccionada(item.actividades); // Guarda las actividades del elemento seleccionado
            setNombreLocal(item.nombreSitio);
            setModalActividadesVisible(true);
            console.log('modalActividadesVisible:', item.actividades); // Agrega esto para verificar si modalActividadesVisible cambia a true
            }}
            >
            <Text>Actividades</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const localesFiltrados = locales.filter(local => local.nombreSitio.toLowerCase().includes(filtro.toLowerCase()));

    return (
    <View>
      <TextInput
        placeholder="Filtrar por nombre..."
        style={styles.input}
        value={filtro}
        onChangeText={(text) => setFiltro(text)}
      />
      <FlatList
        data={localesFiltrados}
        keyExtractor={(item) => item.nombreSitio}
        renderItem={renderItem}
      />
            {modalActividadesVisible && (
        <Modal>
          <ModalActividades 
          actividades={actividadSeleccionada} />
        </Modal>
      )}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <ModalDetalle closeModal={() => setModalVisible(false)} />
      </Modal>
    </View>
  );

  
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    localContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
      },
      imageContainer: {
        marginRight: 10,
      },
      image: {
        width: 80,
        height: 80,
        borderRadius: 8,
      },
      detailsContainer: {
        flex: 1,
      },
      nombre: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      button: {
        backgroundColor: '#3498db',
        padding: 8,
        borderRadius: 5,
        marginTop: 5,
      },
      input: {
        height: 40,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
      },  modalBackground: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
      },
      actividadesHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
      },
      actividadContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
      },
      actividadNombre: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      actividadFecha: {
        fontSize: 14,
        color: '#666',
      },
      agregarButton: {
        backgroundColor: '#2196F3',
        padding: 8,
        borderRadius: 5,
      },
      agregarButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
});
export default LocalList;
