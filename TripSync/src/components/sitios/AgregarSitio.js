import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, FlatList, Pressable,Alert, StyleSheet,Image,TouchableOpacity,ImageBackground  } from 'react-native';
import RegistrarSitio from './RegistrarSitio';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../../utils/context/AuthContext'; // Ajusta la ruta según tu estructura de carpetas
import Swiper from 'react-native-swiper';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AgregarSitio = ({navigation}) => {
  const {user } = useAuth()
 //const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [locales, setLocales] = useState([]);
  const [usuario, setUsuario] = useState(user.user); // Usuario actual, reemplázalo con tu lógica de autenticación
  const [modoEdicion, setModoEdicion] = useState(false);
  const [localSeleccionado, setLocalSeleccionado] = useState(null); 

  useEffect(() => {
    // Lógica para obtener los locales del usuario desde la base de datos
    obtenerLocales();
  }, [usuario]);

  useFocusEffect(
    React.useCallback(() => {
      obtenerLocales();
    }, [user, navigation])
  );


  const handleRegistroClick = () => {
    setModoEdicion(false);
    // Abre el modal cuando se presiona el botón
    setModalVisible(true);

  };

  const obtenerLocales = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:5000/api/locales/getLocalesByUser/${usuario}`);
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      setLocales(response.data);
    } catch (error) {
      console.error('Error al obtener locales:', error);
    }
  };

  const handleEliminarClick = (localId) => {
    // axios.delete(`http://10.0.2.2:5000/api/locales/eliminarSitio/${localId}`)
    //   .then((response) => {
    //     // Lógica después de eliminar con éxito del servidor
    //     Alert.alert('Eliminado','Local eliminado correctamente');
    //   })
    //   .catch((error) => {
    //     // Manejo de errores
    //     Alert.alert('Eliminado','Error al eliminar el local de la base de datos:', error);
    //   });
    
      Alert.alert(
        'Confirmación',
        '¿Estás seguro de que quieres eliminar este local?',
        [
          {
            text: 'Sí',
            onPress: () => {
              axios
                .delete(`http://10.0.2.2:5000/api/locales/eliminarSitio/${localId}`)
                .then((response) => {
                  // Lógica después de eliminar con éxito del servidor
                  Alert.alert('Eliminado', 'Local eliminado correctamente');
                  // Aquí podrías realizar alguna acción adicional si lo deseas
                })
                .catch((error) => {
                  // Manejo de errores
                  Alert.alert('Error', 'Error al eliminar el local de la base de datos:', error);
                });
            },
          },
          {
            text: 'No',
            style: 'cancel',
          },
        ],
        { cancelable: false }
      );
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
    
    
    <ImageBackground
      source={require('../../assets/gruposA.png')} // Ruta de la imagen en tus assets
      style={styles.background}
    >
      <View>
      {locales.length === 0 ? (
        <View style={style={height:'100%', alignItems:'center',justifyContent:'center'}}>
        <Text style={{ fontSize: 20, marginBottom: 20 }}>
          No tienes ningún sitio registrado
        </Text>
        </View>
      ) : (
        <FlatList
          data={locales}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemContainer2}>
              <Swiper style={styles.swiper} showsButtons={true}>
                <View style={styles.slide}>
                  <Image source={require('../../assets/gruposA.png')} style={styles.image} />
                </View>
                <View style={styles.slide}>
                  <Image
                    style={styles.image}
                    source={ require('../../assets/Sitios.png' )}
                  />
                </View>
                <View style={styles.slide}>
                  <Image
                    style={styles.image}
                    source={ require('../../assets/grupos.jpg' )}
                    resizeMode="cover"
                  />
                </View>
                {/* Aquí agregar las demás imágenes del carrusel */}
              </Swiper>
              <View style={styles.detailsContainer}>
                <Text style={styles.nombre}>{item.nombreSitio}</Text>
                <Text style={styles.tipoSitio}>{item.tipoSitio}</Text>
                <View style={styles.buttonsContainer}>
                  <Button title="Editar" onPress={() => handleEditarClick(item)} />
                  <Button title="Eliminar" onPress={() => handleEliminarClick(item._id)} color="red" />
                </View>
              </View>
              </View>
            </View>
          )}
        />
      )}
  
        {/* Botón redondo con ícono */}
  <TouchableOpacity
    style={{
      position: 'absolute',
      bottom: 30,
      right: 20,
      width: 45,
      height: 45,
      borderRadius: 30,
      backgroundColor: 'darkgreen', // Puedes cambiar el color de fondo del botón
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={handleRegistroClick}
  >
    <Icon name="plus" size={30} color="white" />
  </TouchableOpacity>
  
      {/* Modal para registrar/editar sitios */}
      <RegistrarSitio
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        modoEdicion={modoEdicion}
        sitioAEditar={localSeleccionado}
      />
      </View>
      </ImageBackground>
    
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginBottom: 10,
    // borderWidth: 1,
    // borderColor: '#ccc',
    // borderRadius: 8,
    // backgroundColor: 'white',
    // padding: 10,
    // maxWidth:'100%',
    // overflow:'hidden'
    flex:1,
    // borderWidth: 3,
    // borderRadius:20,
    // borderColor: 'lightgray',
    padding:10,
    // marginBottom: 20,
    // backgroundColor:'white'
  },
  itemContainer2: {
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginBottom: 10,
    // borderWidth: 1,
    // borderColor: '#ccc',
    // borderRadius: 8,
    // backgroundColor: 'white',
    // padding: 10,
    // maxWidth:'100%',
    // overflow:'hidden'

    borderWidth: 3,
    borderRadius:20,
    borderColor: 'lightgray',
    marginBottom: 15,
    backgroundColor:'white'
  },
  swiper: {
    // flex:1,
    // padding:20,
    height: 150,
    // width:350
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '95%',
    height: '95%',
    borderRadius: 15,
  },
  detailsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tipoSitio: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
});

export default AgregarSitio;
