import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Locales from './Local'
import Siguiendo from './Siguiendo'

// Componentes de las pestañas
const LocalesRecomendados = () => (
  <View style={styles.scene}>
    <Text>Contenido de Locales Recomendados</Text>
  </View>
);

// Configuración de las pestañas
const Tab = createMaterialTopTabNavigator();

const TabLocales = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        labelStyle: styles.label,
        indicatorStyle: styles.indicator,
        style: styles.tabBar,
      }}
    >
      <Tab.Screen name="Locales Recomendados" component={LocalesRecomendados} />
      <Tab.Screen name="Locales" component={Locales} />
      <Tab.Screen name="Siguiendo" component={Siguiendo} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: 'white',
  },
  indicator: {
    backgroundColor: 'blue',
  },
  label: {
    color: 'black',
  },
});

export default TabLocales;
