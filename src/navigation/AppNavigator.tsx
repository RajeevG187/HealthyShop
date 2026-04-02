/**
 * App Navigator
 * Stack navigation for the app
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CameraScreen } from '../screens/CameraScreen';
import { AnalysisScreen } from '../screens/AnalysisScreen';
import { ResultScreen } from '../screens/ResultScreen';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Camera"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Analysis" component={AnalysisScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
