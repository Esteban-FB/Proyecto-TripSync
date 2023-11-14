import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/logIn/LogIn';
import Dashboard from './src/components/dashboard/Dashboard';
import { AuthProvider } from './src/utils/context/AuthContext'; 

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
    </AuthProvider>
  );
};
export default App;
