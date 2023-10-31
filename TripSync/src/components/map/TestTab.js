import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import MapView from 'react-native-maps';
import axios from 'axios';

const MiComponente = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Realiza la solicitud GET a tu API usando Axios
    // axios.get('http://localhost:5000/api/ejemplos/getEjemplos')
    //   .then(response => {
    //     setData(response.data);
    //   })
    //   .catch(error => {
    //     console.error('Error al obtener datos:', error);
    //   });
    getNews();
  }, []) // El array vacío como segundo argumento hace que el efecto se ejecute solo una vez al montar el componente
  
  const getNews = () => {
    axios.get('http://10.0.2.2:5000/api/ejemplos/getEjemplos')
        .then( (response) =>{
            // handle success
            setData(response.data);
            console.log(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}
  return (
    <View>
      <Text>Listado de Ejemplos:</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            {/* <Text>{item.campo}</Text> */}
            <MapView></MapView>
          </View>
        )}
      />
    </View>

  );
};

export default MiComponente;

