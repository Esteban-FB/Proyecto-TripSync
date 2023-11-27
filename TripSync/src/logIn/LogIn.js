import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ImageBackground, TouchableOpacity, Modal, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { useAuth } from '../utils/context/AuthContext'; // Ajusta la ruta según tu estructura de carpetas


const Login = ({ navigation }) => {
  const { loginUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    user: '',
    email: '',
    password: '',
    rol: 'usuario', // Valor por defecto
  });

  const handleLogin = () => {
    // Lógica de autenticación aquí
    const credentials = {
      username: username,
      password: password,
    };
  
    axios.post('http://10.0.2.2:5000/api/login/login', credentials)
      .then(response => {
        console.log('Respuesta del servidor:', response.data);
        loginUser(response.data);
        // Verificar si el registro fue exitoso antes de navegar
        if (response.status === 200) {
          setUsername('');
          setPassword('');
          navigation.navigate('Dashboard');
        } else {
          console.error('Error en el inicio de sesión:', response.data.error);
          // Manejar errores según tus necesidades
        }
      })
      .catch(error => {
        //console.error('Error en la solicitud POST:', error);
        Alert.alert('Log In','Fallo en el inicio de sesión, las credenciales ingresadas no existen o fueron mal ingresadas.');
        // Manejar errores según tus necesidades
      });

  };

  const handleRegistration = () => {
    // Lógica de registro aquí
    // Puedes enviar los datos al servidor o realizar acciones locales según tu lógica
    const registrationDataJSON = JSON.stringify(registrationData);
    axios.post('http://10.0.2.2:5000/api/login/registrarse', { registrationData: registrationDataJSON })
      .then(response => {
        //console.log('Respuesta del servidor:', response.data);
        Alert.alert('Registro','El usuario se registro con exito.');
        // Manejar la respuesta del servidor según tus necesidades
      })
      .catch(error => {
        //console.error('Error en la solicitud POST:', error);
        Alert.alert('Registro','Hubo un fallo en el registro del usuario.');
        // Manejar errores según tus necesidades
      });
    console.log(registrationData);
    registrationData.user ='';
    registrationData.email ='';
    registrationData.password ='';
    registrationData.rol ='usuario';
    setModalVisible(false);
  };

  return (
    <ImageBackground source={require('../assets/background-image.jpg')} style={styles.container}>
      <Text style={styles.title}>Bienvenido a{'\n'}<Text style={styles.titleBold}>TripSync</Text></Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
      
      {/* Botón para abrir el modal de registro */}
      <TouchableOpacity  marginVertical='10' padding='5,5,5,5' onPress={() => setModalVisible(true)}>
        <Text>Registrarse</Text>
      </TouchableOpacity>

      {/* Modal de registro */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.modalContainer}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.modalTitle}>Registro</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Nombre de Usuario"
            value={registrationData.user}
            onChangeText={(text) => setRegistrationData({ ...registrationData, user: text })}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Correo Electrónico"
            value={registrationData.email}
            onChangeText={(text) => setRegistrationData({ ...registrationData, email: text })}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Contraseña"
            secureTextEntry={true}
            value={registrationData.password}
            onChangeText={(text) => setRegistrationData({ ...registrationData, password: text })}
          />
          {/* Combobox para el rol */}
          <RNPickerSelect
            style={pickerSelectStyles}
            onValueChange={(value) => setRegistrationData({ ...registrationData, rol: value })}
            items={[
              { label: 'Usuario', value: 'usuario' },
              { label: 'Admin', value: 'admin' },
            ]}
            value={registrationData.rol}
          />
          </View>
          <View style={styles.buttonContainer}>
          <Button style={styles.button} title="Registrarse" onPress={handleRegistration} />
          <Button style={styles.button} title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // ... (otros estilos)
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:'white',
    marginBottom:30
  },
  button: {
    flex:1,
    backgroundColor: '#2196F3',
    borderRadius: 20,
    marginRight:10,
    padding: 10,
    width: '30%',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black', // Cambia el color que desees
  },
  titleBold: {
    color: 'blue', // Cambia el color que desees
  },
  input: {
    width: '80%',
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 5,
  },
  // button: {
  //   backgroundColor: '#2196F3',
  //   borderRadius: 5,
  //   padding: 10,
  //   elevation: 2,
  //   marginBottom: 10,
  // },
  
  // Estilos para el modal
  modalContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    width: '80%',
    maxHeight: '50%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    height: 40,
    width: 200,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor:'white'
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    marginBottom: 10,
  },
  inputAndroid: {
    alignSelf:'center',

    height: 50,
    width: 200,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    marginBottom: 10,
    backgroundColor:'lightgray',
    justifyContent: 'center',
    
  },
});
export default Login;
