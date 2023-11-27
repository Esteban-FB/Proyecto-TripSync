import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MapTab from '../map/MapTab';
import TestTab from '../map/TestTab';
import LocalList from '../locales/Local';
import LocalTab from '../locales/TabLocales';
import Agenda from '../agenda/MiAgenda'
import Party from '../parties/Party'
import Icon from 'react-native-vector-icons/FontAwesome';
import AgregarSitio from '../sitios/AgregarSitio';
import { useAuth } from '../../utils/context/AuthContext'; // Ajusta la ruta según tu estructura de carpetas
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { StyleSheet,View,Text,Image } from 'react-native';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { user } = useAuth();

  return (
    <DrawerContentScrollView {...props} style={alignItems='top'}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <View style={styles.userAvatar}>
            <Image
              source={require('../../assets/Sitios.png')}
              style={styles.avatar}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user.user}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.role}>{user.rol}</Text>
          </View>
        </View>
        <View style={styles.drawerItems}>
          <DrawerItemList {...props} />
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const TabNavigator = () => {
  const { user } = useAuth();
  return (
    
    <Tab.Navigator
      initialRouteName="Locales"
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
            tabBarLabel: 'Mis Sitios',
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
    //   initialRouteName="Locales"
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

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  userAvatar: {
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfo: {
    alignItems: 'center',
  },
  username: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  role: {
    fontSize: 14,
    color: 'blue',
    marginBottom: 10,
  },
  drawerItems: {
    marginTop: 20,
  },
});

export default Dashboard;
