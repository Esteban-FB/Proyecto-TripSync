import * as React from 'react';
import { View, Text, Button } from 'react-native';
import RegistrarSitio from './RegistrarSitio';
import { useNavigation } from '@react-navigation/native';

const AgregarSitio = () => {
  const navigation = useNavigation();

  const handleRegistroClick = () => {
    // Navega a la pantalla de registro cuando se presiona el botón
    navigation.navigate('RegistrarSitio');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        No tienes ningún sitio registrado
      </Text>
      <Button
        title="Registrar un sitio"
        onPress={handleRegistroClick}
      />
    </View>
  );
};

export default AgregarSitio;
