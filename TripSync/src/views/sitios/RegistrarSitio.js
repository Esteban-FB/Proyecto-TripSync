//import * as React from 'react';
import React, { useState } from 'react';
import { View, Text, TextInput, Switch, Button, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const RegistrarSitio = () => {
  const [nombreSitio, setNombreSitio] = useState('');
  const [tipoSitio, setTipoSitio] = useState('Hospedaje');
  const [breveDescripcion, setBreveDescripcion] = useState('');
  const [descripcionExtensa, setDescripcionExtensa] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [requiereReserva, setRequiereReserva] = useState(false);
  const [horario, setHorario] = useState('');
  const [contactoTelefono, setContactoTelefono] = useState('');
  const [contactoCorreo, setContactoCorreo] = useState('');

  const handleRegistro = () => {
    // Aquí puedes agregar la lógica para enviar los datos a tu servidor o almacenarlos localmente
  };

  return (
    <ScrollView style={{ padding: 20 }}>
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

      <Button title="Registrar" onPress={handleRegistro} />
    </ScrollView>
  );
};

export default RegistrarSitio;
