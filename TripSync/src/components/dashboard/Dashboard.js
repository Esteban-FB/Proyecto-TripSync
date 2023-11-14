import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ActivitiesTab from '../activitiesTab/ActivitiesTab'; // Importa tus componentes de pestañas aquí
import MapTab from '../map/MapTab';
import LocalList from '../locales/Local';
import Agenda from '../agenda/MiAgenda'
import Icon from 'react-native-vector-icons/FontAwesome';
import AgregarSitio from '../sitios/AgregarSitio';
import { useAuth } from '../../utils/context/AuthContext'; // Ajusta la ruta según tu estructura de carpetas

const Tab = createBottomTabNavigator();

const Dashboard = () => {
  const {user } = useAuth();
  console.log(user.user +" "+user.rol+" "+user.email);
  return (

    <Tab.Navigator
      initialRouteName="TabScreen1"
      screenOptions={{
        activeTintColor: 'blue', // Color de la pestaña activa
        inactiveTintColor: 'gray', // Color de la pestaña inactiva
      }}
    >
      <Tab.Screen
        name="Locales"
        component={LocalList}
        color = "darkblue"
        options={{
          tabBarLabel: 'Locales',
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Mapa"
        component={MapTab}
        color = "darkblue"
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
      {user && user.rol === 'admin' && (
        <Tab.Screen
          name="Sitios"
          component={AgregarSitio}
          options={{
            tabBarLabel: 'Sitios',
            tabBarIcon: ({ color, size }) => (
              <Icon name="list" color={color} size={size} />
            ),
          }}
        />
      )}
      {/* Puedes agregar más pestañas aquí según tus necesidades */}
    </Tab.Navigator>



  );
};

export default Dashboard;
