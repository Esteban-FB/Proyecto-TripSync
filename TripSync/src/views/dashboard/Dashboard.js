import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ActivitiesTab from '../activitiesTab/ActivitiesTab'; // Importa tus componentes de pestañas aquí
import MapTab from '../map/MapTab';
import TestTab from '../map/TestTab';
import AgregarSitio from '../map/AgregarSitio';

const Tab = createBottomTabNavigator();

const Dashboard = () => {
  return (
    
      <Tab.Navigator
        initialRouteName="TabScreen1"
        screenOptions={{
          activeTintColor: 'blue', // Color de la pestaña activa
          inactiveTintColor: 'gray', // Color de la pestaña inactiva
        }}
      >
        <Tab.Screen
          name="TabScreen1"
          component={ActivitiesTab}
          options={{
            tabBarLabel: 'Pestaña 1', // Texto de la pestaña
            // También puedes personalizar el ícono de la pestaña si lo deseas
            // tabBarIcon: ({ color, size }) => (
            //   <Icon name="nombre-del-icono" color={color} size={size} />
            // ),
          }}
        />
        <Tab.Screen
          name="TabScreen2"
          component={TestTab}
          options={{
            tabBarLabel: 'Pestaña 2',
          }}
        />
        <Tab.Screen
          name="Mis Sitios"
          component={AgregarSitio}
          options={{
            tabBarLabel: 'Mis Sitios',
          }}
        />
        {/* Puedes agregar más pestañas aquí según tus necesidades */}
      </Tab.Navigator>
   
  );
};

export default Dashboard;
