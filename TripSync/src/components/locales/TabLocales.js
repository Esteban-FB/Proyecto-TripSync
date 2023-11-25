import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Sitios from './Local'
import Siguiendo from './Siguiendo'
import Recomendados from './LocalesRecomendados'

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
      <Tab.Screen name="Recomendados" component={Recomendados} />
      <Tab.Screen name="Sitios" component={Sitios} />
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
