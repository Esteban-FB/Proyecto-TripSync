import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TextInput, Image, TouchableOpacity, Modal, Button, StyleSheet,ImageBackground,Alert,ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Rating } from 'react-native-ratings';
import ModalDetalle from './ModalDetalle'; 
import axios from 'axios';
import { useAuth } from '../../utils/context/AuthContext'; // Suponiendo que aquí tienes el contexto con la información del usuario
import Swiper from 'react-native-swiper';
import { useFocusEffect } from '@react-navigation/native';

const LocalList = ({navigation}) => {
  const {user } = useAuth(); // Obteniendo la información del usuario desde el contexto

  const [locales, setLocales] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [filtroRating, setFiltroRating] = useState(0); 
  const [modalActividadesVisible, setModalActividadesVisible] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [nombreLocal, setNombreLocal]=useState('');

  const [detalleVisible, setDetalleVisible] = useState(false);
  const [detalleLocal, setDetalleLocal] = useState(null);
  const [detalleUsuarios, setDetalleUsuarios] = useState(null);
  const [localesRecomendados, setLocalesRecomendados] = useState([]);


//   useEffect( () => {

//     if (user) {
//         axios.get(`http://10.0.2.2:5000/api/locales/LocalesRecomendados/${user.user}`)
//         .then(response => {
//           setLocalesRecomendados(response.data); // Almacena los locales recomendados en la nueva variable
//           console.log(localesRecomendados);
//         })
//         .catch(error => {
//           console.error('Error al obtener la lista de locales recomendados', error);
//         });
        
//     }
    
//   }, [user]);

useFocusEffect(
    React.useCallback(() => {
      const fetchLocalesRecomendados = async () => {
        if (user) {
          try {
            const response = await axios.get(`http://10.0.2.2:5000/api/locales/LocalesRecomendados/${user.user}`);
            setLocalesRecomendados(response.data); // Almacena los locales recomendados en la nueva variable
            console.log(localesRecomendados);
          } catch (error) {
            console.error('Error al obtener la lista de locales recomendados', error);
          }
        }
      };

      fetchLocalesRecomendados();
    }, [user, navigation])
  );

  const seguirLocal = (localId) => {
    // // Encontrar el local por su _id y guardarlo en una variable
    const localSeguido = locales.find(local => local._id === localId);

    // Crear el objeto con los datos del usuario y el nuevo seguimiento
    const seguimiento = {
      usuario: user.user, // Usar la información del usuario actual obtenida del contexto
    };

    // // Enviar la información del seguimiento al backend para agregarla al array de usuarios del local
    // axios.post(`http://10.0.2.2:5000/api/locales/seguirLocal/${localId}`, seguimiento)
    // .then(response => {
    //   // Si la operación fue exitosa, filtramos los locales para obtener todos menos el que se está siguiendo
    //   const nuevosLocales = locales.filter(local => local._id !== localId);
    //   setLocales(nuevosLocales); // Actualizar la lista de locales en el estado
    // })
    // .catch(error => {
    //   console.error('Error al seguir el local', error);
    // });
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que quieres seguir este local?',
      [
        {
          text: 'Sí',
          onPress: () => {
            axios
              .post(`http://10.0.2.2:5000/api/locales/seguirLocal/${localId}`, seguimiento)
              .then((response) => {
                // Si la operación fue exitosa, filtramos los locales para obtener todos menos el que se está siguiendo
                const nuevosLocales = locales.filter((local) => local._id !== localId);
                setLocales(nuevosLocales); // Actualizar la lista de locales en el estado
              })
              .catch((error) => {
                console.error('Error al seguir el local', error);
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


  const handleAgregarActividadEnOtroLugar = async (actividad, localNombre) => {
    const selectedDay = actividad.fecha; // Obtener la fecha de la actividad
    const newEventText = nombreLocal; // Nombre del Local del item que contiene las actividades
    const newEventDetails = actividad.nombre; // Nombre de la actividad
    console.log("fecha: ",selectedDay," ","EventoN: ",newEventText," ","Detalle: ",newEventDetails, "usuario: ", user.user);
    try {
      // Enviar el evento al servidor usando Axios
      await axios.post('http://10.0.2.2:5000/api/agenda/agregar-evento', {
        date: selectedDay,
        text: newEventText,
        details: newEventDetails,
        usuario:user.user,
      });
  
      // Manejar la respuesta del servidor si es necesario
      Alert.alert('Evento', 'El evento se ha agregado a la agenda.')
    } catch (error) {
      //console.error('Error al enviar el evento al servidor:', error.message);
      Alert.alert('Evento', 'Hubo un problema al agregar el evento.')
      // Puedes manejar el error según tus necesidades
    }
  };

  const ModalActividades = ({ actividades }) => {
    return (
<View style={styles.centeredView}>
  <View style={styles.modalContainer}>
    <Text style={styles.actividadesHeaderText}>Actividades del lugar</Text>
    <View style={styles.separator2} />
    <ScrollView style={styles.scrollView}>
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
              <Text style={styles.agregarButtonText}>Agregar en Agenda</Text>
            </TouchableOpacity>
            <View style={styles.separator2} />
          </View>
        ))}
    </ScrollView>
    <Button title="Cerrar" onPress={() => setModalActividadesVisible(false)} />
  </View>
</View>
    );
  };

  const renderItem = ({ item }) => (

    <View style={styles.itemContainer2}>
    <View style={styles.localContainer}>
      <Swiper style={styles.wrapper} showsButtons={true}>
        <View style={styles.slide}>
          <Image source={require('../../assets/palmera.jpeg')} style={styles.image} />
        </View>
        <View style={styles.slide}>
        <Image
          style={styles.image}
          source={ require('../../assets/playa.jpg' )}
          resizeMode="cover"
        />
      </View>
      <View style={styles.slide}>
        <Image
          style={styles.image}
          source={ require('../../assets/playa2.0.jpg' )}
          resizeMode="cover"
        />
      </View>
      </Swiper>
      <View style={styles.detailsContainer}>
        <Text style={styles.nombre}>{item.nombreSitio} - {item.tipoSitio}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.ratingContainer}>
          <Rating
            type="star"
            startingValue={item.rating}
            imageSize={20}
            showRating={false}
            readonly={true}
          />
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button2} onPress={() => seguirLocal(item._id)}>
          <Text style={styles.buttonText}>Seguir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log("Este es el item a mostrar el detalle: ", item);
            
            setDetalleLocal(item);
            setDetalleUsuarios(item.reviews);
            setDetalleVisible(true);
          }}
        >
          <Text style={styles.buttonText}>Detalles</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {
            setActividadSeleccionada(item.actividades); // Guarda las actividades del elemento seleccionado
            setNombreLocal(item.nombreSitio);
            setModalActividadesVisible(true);
            console.log('modalActividadesVisible:', item.actividades); // Agrega esto para verificar si modalActividadesVisible cambia a true
            }}
            >
            <Text style={styles.buttonText}>Actividades</Text>
        </TouchableOpacity>
        </View>
      </View>
      {/* <View style={styles.separator} /> */}
    </View>
    </View>
  );
  
    return (
    <View>
      
      {localesRecomendados && localesRecomendados.length === 0 ? (
    // Si localesRecomendados está vacío, muestra un mensaje o componente alternativo
    <ImageBackground
      source={require('../../assets/booking.jpg')} // Ruta de la imagen en tus assets
      style={styles.background}
    >
      <View style={style={height:'100%', alignItems:'center',justifyContent:'center'}}>
    <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 20 }}>
      No hay locales recomendados disponibles.
    </Text>
</View> 
    </ImageBackground>
  ) : (
    // Si localesRecomendados tiene elementos, renderiza el contenido con ImageBackground
    <ImageBackground
      source={require('../../assets/booking.jpg')} // Ruta de la imagen en tus assets
      style={styles.background}
    >
      <FlatList
        data={localesRecomendados}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
      {modalActividadesVisible && (
        <Modal
        animationType="slide"
        transparent={true}
        >
          <ModalActividades 
            actividades={actividadSeleccionada}
          />
        </Modal>
      )}
      {detalleVisible && detalleLocal && detalleUsuarios && (
        <ModalDetalle
          local={detalleLocal}
          usuarios={detalleUsuarios}
          closeModal={() => setDetalleVisible(false)}
        />
      )}
    </ImageBackground>
  )}
        {/* <ImageBackground
      source={require('../../assets/gruposA.png')} // Ruta de la imagen en tus assets
      style={styles.background}
    >
      <FlatList
        data={localesRecomendados}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
      {modalActividadesVisible && (
        <Modal>
          <ModalActividades 
          actividades={actividadSeleccionada} />
        </Modal>
      )}
      {detalleVisible && detalleLocal && detalleUsuarios && (
        <ModalDetalle
          local={detalleLocal}
          usuarios={detalleUsuarios}
          closeModal={() => setDetalleVisible(false)}
        />
      )}
      
      </ImageBackground> */}
    </View>

  );

  
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer2: {
    flex:1,
    padding:15,
  },
  // modalContainer: {
  //   width: '80%',
  //   height: '80%',
  //   backgroundColor: 'white',
  //   padding: 20,
  //   borderRadius: 10,
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   elevation: 5,
  // },
  // actividadesHeaderText: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginBottom: 10,
  //   textAlign: 'center',
  // },
  // actividadContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginBottom: 15,
  // },
  // actividadNombre: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  // },
  // actividadFecha: {
  //   fontSize: 14,
  //   color: '#666',
  // },
  // agregarButton: {
  //   backgroundColor: '#2196F3',
  //   padding: 8,
  //   borderRadius: 5,
  // },
  // agregarButtonText: {
  //   color: 'white',
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  // },    
  // separator: {
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#ccc',
  //   marginBottom: 5,
  // },  
  filtersContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterRow: {
    
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputtext: {
    flex: 1,
    height: 35,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  smallInput: {
    flex: 1,
    height: 35,
    maxWidth: '48%', // Ajusta el tamaño según lo necesario
  },
  picker: {
    flex: 1,
    height: 30,
    backgroundColor: 'lightgray',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  smallPicker: {
    height: 30,
    borderRadius: 30,
    maxWidth: '48%',
    maxHeight: '10%', // Ajusta el tamaño según lo necesario
  },
  listContent: {
    paddingBottom: 100, // Ajusta el valor según sea necesario
  },
  //para el carrusel de imagenes
  localContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 15,
    marginBottom: 15,
  },
  wrapper: {
    height: 200,
    marginBottom: 15,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  detailsContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex:1,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    marginRight:10,
    padding: 10,
    width: '30%',
    alignItems: 'center',
  },
  button2: {
    flex:1,
    backgroundColor: 'darkgreen',
    borderRadius: 5,
    marginRight:10,
    padding: 10,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //Aqui
  modalContainer: {
            width: '80%',
    height: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  actividadesHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollView: {
    //maxHeight: auto, // Altura máxima para el ScrollView (ajustar según necesidades)
    width: '100%',
  },
  actividadContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  actividadNombre: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actividadFecha: {
    fontSize: 14,
  },
  agregarButton: {
    marginTop: 5,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  agregarButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  separator2: {
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    marginBottom: 5,
  },
});
export default LocalList;
