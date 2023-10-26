import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ActivitiesTab from '../activitiesTab/ActivitiesTab'; // Importa tus componentes de pestañas aquí
import MapTab from '../map/MapTab';
import TestTab from '../map/TestTab';
import Agenda from '../agenda/MiAgenda'
import Icon from 'react-native-vector-icons/FontAwesome';


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
        name="Actividades"
        component={ActivitiesTab}
        options={{
          tabBarLabel: 'Actividades', // Texto de la pestaña
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Mapa"
        component={TestTab}
        options={{
          tabBarLabel: 'Mapa',
          tabBarIcon: ({ color, size }) => (
            <Icon name="map" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Agenda"
        component={Agenda}
        options={{
          tabBarLabel: 'Agenda',
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" color={color} size={size} />
          ),
        }}
      />
      {/* Puedes agregar más pestañas aquí según tus necesidades */}
    </Tab.Navigator>



  );
};

export default Dashboard;
