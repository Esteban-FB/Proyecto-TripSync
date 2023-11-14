// LocalList.js
import React,{ useEffect, useState} from 'react';
import { View, Text, FlatList, TextInput, Image, TouchableOpacity, Modal, Button, StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';
import ModalDetalle from './ModalDetalle'; 
import axios from 'axios';

const LocalList = () => {
  const [locales, setLocales] = useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    // Hacer una solicitud a tu API de MongoDB para obtener la lista de locales
    axios.get('http://10.0.2.2:5000/api/locales/getLocales')
    .then(response => {
      console.log(response.data);
      setLocales(response.data);
    })
    .catch(error => {
      console.error('Error al obtener la lista de locales', error);
    });
  
  }, []);



  const renderItem = ({ item }) => (
    <View style={styles.localContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.foto }} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Rating
            type="star"
            startingValue={item.calificacionPromedio}
            imageSize={20}
            showRating={false}
            onFinishRating={() => {}}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => /* seguirLocal(item.nombre) */ setModalVisible(true)}>
          <Text>Seguir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text>Detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const localesFiltrados = locales.filter(local => local.nombre.toLowerCase().includes(filtro.toLowerCase()));

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
        keyExtractor={(item) => item.nombre}
        renderItem={renderItem}
      />
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
      },
});
export default LocalList;
