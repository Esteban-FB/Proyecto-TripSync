//import * as React from 'react';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, Button, Image, ScrollView, Modal, Pressable,StyleSheet,AccessibilityActionEvent,Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../utils/context/AuthContext'; // Ajusta la ruta según tu estructura de carpetas
import axios from 'axios';

const RegistrarSitio = ({visible, onClose, modoEdicion = false, sitioAEditar }) => {
  const {user } = useAuth();
  const [_id, setID] = useState(null);
  const [nombreSitio, setNombreSitio] = useState('');
  const [tipoSitio, setTipoSitio] = useState('Hospedaje');
  const [descripcionExtensa, setDescripcionExtensa] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [requiereReserva, setRequiereReserva] = useState(false);
  const [horario, setHorario] = useState('');
  const [contactoTelefono, setContactoTelefono] = useState('');
  const [contactoCorreo, setContactoCorreo] = useState('');
  const [Latitud, SetLatitud] = useState(0);
  const [Longitud, SetLongitud] = useState(0);
  const [actividades, setActividades] = useState([]); // Vector para almacenar actividades
  const [nuevaActividad, setNuevaActividad] = useState({
    nombre: '',
    fecha: '',
  });
  const [rating, SetRating] = useState(0);
  const [usuarios, setUsuarios] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [usuarioLocal, setUser] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (modoEdicion && sitioAEditar) {
      console.log("Este es el sitio a editar: ",sitioAEditar);
      // Si está en modo edición y hay datos del sitio a editar, carga los valores en los estados del formulario
      setNombreSitio(sitioAEditar.nombreSitio || ''); // Reemplaza 'nombreSitio' con el nombre del campo correspondiente
      setTipoSitio(sitioAEditar.tipoSitio || '');
      setDescripcionExtensa(sitioAEditar.descripcionExtensa || ''); 
      setUbicacion(sitioAEditar.ubicacion || ''); 
      setRequiereReserva(sitioAEditar.requiereReserva || false); 
      setHorario(sitioAEditar.horario || ''); 
      setContactoTelefono(sitioAEditar.contactoTelefono || ''); 
      setContactoCorreo(sitioAEditar.contactoCorreo || ''); 
      SetLatitud(sitioAEditar.Latitud || ''); 
      SetLongitud(sitioAEditar.Longitud || ''); 
      setActividades(sitioAEditar.actividades || ''); 
      SetRating(sitioAEditar.rating || 0); 
      setUsuarios(sitioAEditar.usuarios || []); 
      setReviews(sitioAEditar.reviews || [])
      setUser(sitioAEditar.usuarioLocal || ''); 
      setID(sitioAEditar._id || ''); 
      console.log("Este es el id del sitio:",_id);
      
      // ...establece otros valores del sitio a editar en los estados correspondientes del formulario
    } else {
      // Si no estás en modo edición, puedes restablecer los campos del formulario
      setNombreSitio('');
      setTipoSitio('Hospedaje');
      setDescripcionExtensa(''); 
      setUbicacion(''); 
      setRequiereReserva(false); 
      setHorario(''); 
      setContactoTelefono(''); 
      setContactoCorreo(''); 
      SetLatitud(''); 
      SetLongitud('');
      setUser(user.user); 
      setActividades([]); 
      setID(''); 
      // ...restablece otros campos del formulario según sea necesario
    }
  }, [modoEdicion, sitioAEditar]);

  
  const handleAgregarActividad = () => {
    // Agrega la nueva actividad al vector de actividades
    const actividad = { ...nuevaActividad };
    setActividades([...actividades, actividad]);
    setNuevaActividad({ nombre: '', fecha: '' });
  };

  const handleDeleteActividad = (index) => {
    const updatedActividades = [...actividades];
    updatedActividades.splice(index, 1);
    setActividades(updatedActividades);
  };

  const handleRegistro = async () => {
    console.log(user);
    setUser(user.user);
    // Lógica para enviar o almacenar los datos, incluyendo actividades
    const sitio = {
      _id,
      nombreSitio,
      tipoSitio,
      descripcionExtensa,
      ubicacion,
      Latitud,
      Longitud,
      requiereReserva,
      horario,
      contactoTelefono,
      contactoCorreo,
      actividades,
      rating,
      usuarios,
      reviews,
      usuarioLocal

    };
    console.log("Sitio: ",sitio);
    try {
      const response = await axios.post('http://10.0.2.2:5000/api/locales/registrarLocales', sitio);
      // console.log("Respuesta del servidor:", response.data);
      Alert.alert('Sitios','Se registro o actualizo con exito el sitio.');
      onClose();
    } catch (error) {
      // console.error('Error al enviar datos al servidor:', error);
      Alert.alert('Sitios','Hubo un error al guardar o actualizar el nuevo sitio.');
      // Manejo de errores
    }
    setNombreSitio('');
    setTipoSitio('Hospedaje');
    setDescripcionExtensa(''); 
    setUbicacion(''); 
    setRequiereReserva(false); 
    setHorario(''); 
    setContactoTelefono(''); 
    setContactoCorreo(''); 
    SetLatitud(''); 
    SetLongitud(''); 
    setActividades([]); 
    setID(''); 

    onClose();
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate instanceof Date) {
      setSelectedDate(selectedDate);
  
      // Formatear la fecha en el formato AAAA-MM-DD
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setNuevaActividad({ ...nuevaActividad, fecha: formattedDate });
    }
  };

  return (
<Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <ScrollView style={{ padding: 20, backgroundColor: 'white'}}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre del sitio:</Text>
        <TextInput
          
          style={styles.input}
          placeholder="Ejemplo: Hotel Paradise"
          value={nombreSitio}
          onChangeText={text => setNombreSitio(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tipo de sitio:</Text>
        <Picker
        
          style={styles.picker}
          selectedValue={tipoSitio}
          onValueChange={itemValue => setTipoSitio(itemValue)}
        >
        <Picker.Item label="Hospedaje" value="Hospedaje" />
        <Picker.Item label="Recreativo" value="Recreativo" />
        <Picker.Item label="Aventura" value="Aventura" />
        <Picker.Item label="Rural" value="Rural" />
        <Picker.Item label="Gastronómico" value="Gastronómico" />
        <Picker.Item label="Natural" value="Natural" />
        <Picker.Item label="Otro" value="Otro" />
      </Picker>
      </View>

      <View style={styles.inputContainer}>
      <Text style={styles.label}>Descripción:</Text>
      <TextInput
      style={styles.input}
        placeholder="Escribe una descripción más detallada..."
        multiline
        numberOfLines={4}
        value={descripcionExtensa}
        onChangeText={text => setDescripcionExtensa(text)}
      />
      <View>
      </View>

      <View style={styles.inputContainer}>
      <Text style={styles.label}>Direccion:</Text>
      <TextInput
      style={styles.input}
        placeholder="Ejemplo: 123 Calle Principal, Ciudad"
        value={ubicacion}
        onChangeText={text => setUbicacion(text)}
      />
      </View>
      <View style={styles.inputContainer}>
      <Text style={styles.label}>Coordenadas:</Text>
      <View style={styles.buttonsContainer2}>
        <TextInput
        style={styles.input}
          keyboardType='numeric'
          placeholder="Latitud"
          value={Latitud.toString()}
          onChangeText={text => SetLatitud(text)}
        />
        <TextInput
        style={styles.input}
          keyboardType='numeric'
          placeholder="Longitud"
          value={Longitud.toString()}
          onChangeText={text => SetLongitud(text)}
        />
        </View>
      </View>
      </View>
      <View style={styles.inputContainerReserva}>
      <Text style={styles.labelReserva}>Requiere reserva:</Text>
      <Switch
        value={requiereReserva}
        onValueChange={value => setRequiereReserva(value)}
      />
    </View>
      {/*Actividades*/}

      {/* Mostrar actividades agregadas */}
    {/* Actividades */}
    <View style={styles.activitiesContainer}>
      <Text style={styles.sectionTitle}>Actividades:</Text>
      {actividades.map((actividad, index) => (
        <View key={index} style={styles.activityItem}>
          <Text>{actividad.nombre} - {actividad.fecha}</Text>
          <Button title="Eliminar" onPress={() => handleDeleteActividad(index)} color="red" />
        </View>
      ))}
    </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nueva Actividad:</Text>
        <TextInput
        style={styles.input}
          placeholder="Nombre de la actividad"
          value={nuevaActividad.nombre}
          onChangeText={text => setNuevaActividad({ ...nuevaActividad, nombre: text })}
        />
        </View>

        <View style={styles.buttonsContainer2}>
        <Button title="Agregar Actividad" onPress={handleAgregarActividad} />

        {/* DatePicker para la fecha de la nueva actividad */}
        <Button title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        </View>
      {/* Agregar opción para adjuntar fotos o videos según tus necesidades */}
          <View style={styles.inputContainer}>
          <Text style={styles.label}>Horario:</Text>
          <TextInput
          style={styles.input}
            placeholder="Ejemplo: Abierto de 9:00 AM a 6:00 PM"
            value={horario}
            onChangeText={text => setHorario(text)}
          />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contacto (Teléfono):</Text>
        <TextInput
        style={styles.input}
          placeholder="Ejemplo: (+506) 2222-2222"
          value={contactoTelefono}
          onChangeText={text => setContactoTelefono(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contacto (Correo):</Text>
        <TextInput
        style={styles.input}
          placeholder="Ejemplo: correo@example.com"
          value={contactoCorreo}
          onChangeText={text => setContactoCorreo(text)}
        />
      </View>
      <View style={styles.buttonsContainer3}>
        <Button style={styles.button} title={modoEdicion ? 'Actualizar' : 'Registrar'} onPress={handleRegistro} />
        <Button style={styles.button} title="Cerrar" onPress={onClose} />
      </View>
      </ScrollView>

      </Modal>
  );
};

const styles = {
  inputContainer: {
    marginBottom: 20,
  },
  inputContainerFinal: {
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  activitiesContainer: {
    //maxHeight: 150,
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:'white'
  },
  bottom:{
    padding:100
  },
  inputContainerReserva: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  labelReserva: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonsContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:'white',
    marginBottom:5
  },
  buttonsContainer3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:'white',
    marginBottom:30
    
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
};

export default RegistrarSitio;
