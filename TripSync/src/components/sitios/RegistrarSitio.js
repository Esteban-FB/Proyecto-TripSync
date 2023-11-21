//import * as React from 'react';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, Button, Image, ScrollView, Modal, Pressable } from 'react-native';
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
      console.log("Respuesta del servidor:", response.data);
      onClose();
    } catch (error) {
      console.error('Error al enviar datos al servidor:', error);
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
      <ScrollView style={{ padding: 20, backgroundColor: 'white', flex: 1 }}>
        <Text>Nombre del sitio:</Text>
        <TextInput
          placeholder="Ejemplo: Hotel Paradise"
          value={nombreSitio}
          onChangeText={text => setNombreSitio(text)}
        />

      <Text>Tipo de sitio:</Text>
      <Picker
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

      <Text>Descripción:</Text>
      <TextInput
        placeholder="Escribe una descripción más detallada..."
        multiline
        numberOfLines={4}
        value={descripcionExtensa}
        onChangeText={text => setDescripcionExtensa(text)}
      />
      <View>
      <Text>Ubicación:</Text>
      <Text>Direccion:</Text>
      <TextInput
        placeholder="Ejemplo: 123 Calle Principal, Ciudad"
        value={ubicacion}
        onChangeText={text => setUbicacion(text)}
      />
      <Text>Coordenadas:</Text>
      <TextInput
        keyboardType='numeric'
        placeholder="Latitud"
        value={Latitud}
        onChangeText={text => SetLatitud(text)}
      />
      <TextInput
        keyboardType='numeric'
        placeholder="Longitud"
        value={Longitud}
        onChangeText={text => SetLongitud(text)}
      />
      </View>
      <Text>Requiere reserva:</Text>
      <Switch
        value={requiereReserva}
        onValueChange={value => setRequiereReserva(value)}
      />

      {/*Actividades*/}
      {/* Mostrar actividades agregadas */}
      <Text>Actividades:</Text>
        {actividades.map((actividad, index) => (
          <View key={index}>
            <Text>{actividad.nombre} - {actividad.fecha}</Text>
            <Button title="Eliminar" onPress={() => handleDeleteActividad(index)} />
          </View>
        ))}

        <Text>Nueva Actividad:</Text>
        <TextInput
          placeholder="Nombre de la actividad"
          value={nuevaActividad.nombre}
          onChangeText={text => setNuevaActividad({ ...nuevaActividad, nombre: text })}
        />

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
      {/* Agregar opción para adjuntar fotos o videos según tus necesidades */}

      <Text>Horario:</Text>
      <TextInput
        placeholder="Ejemplo: Abierto de 9:00 AM a 6:00 PM"
        value={horario}
        onChangeText={text => setHorario(text)}
      />

      <Text>Contacto (Teléfono):</Text>
      <TextInput
        placeholder="Ejemplo: (+506) 2222-2222"
        value={contactoTelefono}
        onChangeText={text => setContactoTelefono(text)}
      />

      <Text>Contacto (Correo):</Text>
      <TextInput
        placeholder="Ejemplo: correo@example.com"
        value={contactoCorreo}
        onChangeText={text => setContactoCorreo(text)}
      />

      </ScrollView>

      <Button title={modoEdicion ? 'Actualizar' : 'Registrar'} onPress={handleRegistro} />
      <Button title="Cerrar" onPress={onClose} />
      </Modal>
  );
};

export default RegistrarSitio;
