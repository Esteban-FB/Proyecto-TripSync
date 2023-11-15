//import * as React from 'react';
import React, { useState } from 'react';
import { View, Text, TextInput, Switch, Button, Image, ScrollView, Modal, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';


const RegistrarSitio = ({ visible, onClose, modoEdicion = false }) => {
  const [nombreSitio, setNombreSitio] = useState('');
  const [tipoSitio, setTipoSitio] = useState('Hospedaje');
  const [breveDescripcion, setBreveDescripcion] = useState('');
  const [descripcionExtensa, setDescripcionExtensa] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [requiereReserva, setRequiereReserva] = useState(false);
  const [horario, setHorario] = useState('');
  const [contactoTelefono, setContactoTelefono] = useState('');
  const [contactoCorreo, setContactoCorreo] = useState('');
  const [actividades, setActividades] = useState([]); // Vector para almacenar actividades
  const [nuevaActividad, setNuevaActividad] = useState({
    nombre: '',
    fecha: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const handleRegistro = () => {
    // Lógica para enviar o almacenar los datos, incluyendo actividades
    const sitio = {
      nombreSitio,
      tipoSitio,
      breveDescripcion,
      descripcionExtensa,
      ubicacion,
      requiereReserva,
      horario,
      contactoTelefono,
      contactoCorreo,
      actividades,
    };
    // ... Hacer algo con el objeto "sitio"
    // ...

    // Cerrar el modal después de registrar
    onClose();
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate instanceof Date) {
      setSelectedDate(selectedDate);
      setNuevaActividad({ ...nuevaActividad, fecha: selectedDate.toString() });
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

      <Text>Breve descripción:</Text>
      <TextInput
        placeholder="Ejemplo: Un lugar paradisíaco para relajarse."
        value={breveDescripcion}
        onChangeText={text => setBreveDescripcion(text)}
      />

      <Text>Descripción extensa:</Text>
      <TextInput
        placeholder="Escribe una descripción más detallada..."
        multiline
        numberOfLines={4}
        value={descripcionExtensa}
        onChangeText={text => setDescripcionExtensa(text)}
      />

      <Text>Ubicación:</Text>
      <TextInput
        placeholder="Ejemplo: 123 Calle Principal, Ciudad"
        value={ubicacion}
        onChangeText={text => setUbicacion(text)}
      />

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
