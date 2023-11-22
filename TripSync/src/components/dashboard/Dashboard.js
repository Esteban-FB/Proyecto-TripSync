import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ActivitiesTab from '../activitiesTab/ActivitiesTab'; // Importa tus componentes de pestañas aquí
import MapTab from '../map/MapTab';
import LocalList from '../locales/Local';
import LocalTab from '../locales/TabLocales';
import Agenda from '../agenda/MiAgenda'
import Party from '../parties/Party'
import Icon from 'react-native-vector-icons/FontAwesome';
import AgregarSitio from '../sitios/AgregarSitio';
import { useAuth } from '../../utils/context/AuthContext'; // Ajusta la ruta según tu estructura de carpetas
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { user } = useAuth();

  return (
    <DrawerContentScrollView {...props} style={{ paddingRight: 60 }}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Ver Perfil"
        onPress={() => {
          console.log('Ver Perfil');
        }}
      />
    </DrawerContentScrollView>
  );
};

const TabNavigator = () => {
  const { user } = useAuth();
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
        component={LocalTab}
        color = "darkblue"
        options={{
          tabBarLabel: 'Locales',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
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
      
      <Tab.Screen
        name="Mis grupos"
        component={Party}
        options={{
          tabBarLabel: 'Grupo',
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
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


const Dashboard = () => {
  const {user } = useAuth();
  console.log(user.user +" "+user.rol+" "+user.email);
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ drawerType: 'slide', drawerPosition: 'left',}}
    >
      <Drawer.Screen name=" " component={TabNavigator} />
    </Drawer.Navigator>
    // <Tab.Navigator
    //   initialRouteName="TabScreen1"
    //   screenOptions={{
    //     activeTintColor: 'blue', // Color de la pestaña activa
    //     inactiveTintColor: 'gray', // Color de la pestaña inactiva
    //   }}
    // >
    //   <Tab.Screen
    //     name="Locales"
    //     component={LocalTab}
    //     color = "darkblue"
    //     options={{
    //       tabBarLabel: 'Locales',
    //       tabBarIcon: ({ color, size }) => (
    //         <Icon name="home" color={color} size={size} />
    //       ),
    //     }}
    //   />
    //   <Tab.Screen
    //     name="Mapa"
    //     component={MapTab}
    //     color = "darkblue"
    //     options={{
    //       tabBarLabel: 'Mapa',
    //       tabBarIcon: ({ color, size }) => (
    //         <Icon name="map" color={color} size={size} />
    //       ),
    //     }}
    //   />
    //   <Tab.Screen
    //     name="Agenda"
    //     component={Agenda}
    //     options={{
    //       tabBarLabel: 'Agenda',
    //       tabBarIcon: ({ color, size }) => (
    //         <Icon name="calendar" color={color} size={size} />
    //       ),
    //     }}
    //   />
      
    //   <Tab.Screen
    //     name="Mis grupos"
    //     component={Party}
    //     options={{
    //       tabBarLabel: 'Grupo',
    //       tabBarIcon: ({ color, size }) => (
    //         <Icon name="user" color={color} size={size} />
    //       ),
    //     }}
    //   />

    //   {user && user.rol === 'admin' && (
    //     <Tab.Screen
    //       name="Sitios"
    //       component={AgregarSitio}
    //       options={{
    //         tabBarLabel: 'Sitios',
    //         tabBarIcon: ({ color, size }) => (
    //           <Icon name="list" color={color} size={size} />
    //         ),
    //       }}
    //     />
    //   )}


    //   {/* Puedes agregar más pestañas aquí según tus necesidades */}
    // </Tab.Navigator>



  );
};

export default Dashboard;
