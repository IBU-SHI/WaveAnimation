import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Wave } from './components/Wave';
import HomeScreen from './components/Home';
import BarGraph from './components/BarGraph';


const Stack = createNativeStackNavigator();
function App(): React.JSX.Element {
  return (
     <NavigationContainer>
     <Stack.Navigator initialRouteName="Home">
       <Stack.Screen name="Home" component={HomeScreen} />
       <Stack.Screen name="Water Drop" component={Wave} />
       <Stack.Screen name="Bar Graph" component={BarGraph} />
     </Stack.Navigator>
   </NavigationContainer>
  );
}

export default App;
