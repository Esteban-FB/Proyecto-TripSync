import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/logIn/LogIn';
import Dashboard from './src/components/dashboard/Dashboard';
import { AuthProvider } from './src/utils/context/AuthContext'; 
import { FirebaseProvider } from './src/utils/firebase/FireBaseContext';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();

const CustomDrawerContent = (props) => {


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



const App = () => {
  return (
    <FirebaseProvider>
    <AuthProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
          {/* <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ drawerType: 'slide', drawerPosition: 'left',}}
      initialRouteName="Login"
    >
      <Drawer.Screen name="Login" component={Login} />
      <Drawer.Screen name="Dashboard" component={Dashboard} />
    </Drawer.Navigator> */}

    </NavigationContainer>
    </AuthProvider>
    </FirebaseProvider>
  );
};
export default App;
