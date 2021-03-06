import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Feather';
import Font from 'react-native-vector-icons/FontAwesome5';
import Ion from 'react-native-vector-icons/Ionicons'
import AdminHomeScreen from './adminHomeScreen';
import AdminMapScreen from './adminMapScreen';
import AdminReportScreen from './adminReportScreen';
import AdminProfileScreen from './adminProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabScreen = () => (
  <Tab.Navigator
    initialRouteName="Home"
    tabBarOptions={{
      activeTintColor: '#8352F2',
      style: {
        paddingTop: 10,
      },
    }}
  >

    <Tab.Screen
      name="Events"
      component={AdminHomeScreen}
      options={{
        tabBarLabel: 'Events',
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="event" color={color} size={size} />
        ),
      }}
    />

    <Tab.Screen
      name="Map"
      component={AdminMapScreen}
      options={{
        tabBarLabel: 'Map',
        tabBarIcon: ({ color, size }) => (
          <Font name="map" color={color} size={size} />
        ),
      }}
    />

    <Tab.Screen
      name="Report"
      component={AdminReportScreen}
      options={{
        tabBarLabel: 'Report',
        tabBarIcon: ({ color, size }) => (
          <Ion name="analytics" color={color} size={35} />
        ),
      }}
    />

    <Tab.Screen
      name="Profile"
      component={AdminProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <Ion name="ios-person" color={color} size={size} />
        ),
      }}
    />

  </Tab.Navigator>
);

export default BottomTabScreen;
