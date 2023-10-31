import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/logIn/LogIn';
import Dashboard from './src/components/dashboard/Dashboard';
import RegistrarSitio from './src/components/sitios/RegistrarSitio'; 

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="RegistrarSitio" component={RegistrarSitio} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
