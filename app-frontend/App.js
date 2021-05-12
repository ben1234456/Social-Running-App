import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';
import SplashScreen from './screens/SplashScreen';
import StartedScreen from './screens/StartedScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import AppNavigation from './screens/AppNavigation';
import eventDetails from "./screens/eventDetails";
import TopTabNavigator from "./screens/TopTabNavigator";
import couponScreen from "./screens/couponScreen";
import couponDetails from "./screens/couponDetails";
import submitRun from "./screens/submitRun";

import musicScreen from "./screens/MusicScreen";
import activitySetup from "./screens/ActivitySetup";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';
import addRouteScreen from "./screens/addRouteScreen";
import editProfileScreen from "./screens/editProfileScreen";
import eventsScreen from "./screens/EventsScreen";
import upcomingEventsScreen from './screens/UpcomingEventsScreen';
import activityHistoryScreen from './screens/ActivityHistoryScreen';

const Stack = createStackNavigator();
LogBox.ignoreAllLogs = true;

export default class App extends Component {
    render() {
        return (
            /*<Router>
                <Scene key='root'>
                    <Scene key='splash' component={SplashScreen} initial={true} headerShown={false}></Scene>
                    <Scene key="start" component={StartedScreen} headerShown={false}></Scene>
                    <Scene key="login" component={LoginScreen} headerShown={false}></Scene>
                    <Scene key="register" component={SignUpScreen} headerShown={false}></Scene>

                    <Scene key="app" component={AppNavigation}  initial={false} headerShown={false}></Scene>
                    <Scene key="eventDetails" component={eventDetails} headerShown={false}></Scene>
                    <Scene key="coupon" component={couponScreen}  initial={false} headerShown={false}></Scene>
                    <Scene key="top" component={TopTabNavigator} headerShown={false}></Scene>
                    <Scene key="couponDetails" component={couponDetails} initial={false} headerShown={false}></Scene>
                    <Scene key="submitRun" component={submitRun} initial={false} headerShown={false}></Scene>
                    <Scene key="addRouteScreen" component={addRouteScreen} initial={false} headerShown={false}></Scene>
                    <Scene key="Music" component={musicScreen} initial={false} titleStyle={{ alignSelf: 'center' }}></Scene>
                </Scene>               
            </Router>*/
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="splash"
                        component={SplashScreen}
                        initial={true} options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="start"
                        component={StartedScreen}
                        initial={false} options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="login"
                        component={LoginScreen}
                        initial={false} options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="register"
                        component={SignUpScreen}
                        initial={false} options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="app"
                        component={AppNavigation}
                        initial={false} options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="eventDetails"
                        component={eventDetails}
                        initial={false} options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="Coupon"
                        component={couponScreen}
                        initial={false}
                        options={{headerTitleAlign: 'center', title: 'Registered Events'}}
                    />
                    <Stack.Screen
                        name="top"
                        component={TopTabNavigator}
                        initial={false} options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="couponDetails"
                        component={couponDetails}
                        initial={false} options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="submitRun"
                        component={submitRun}
                        initial={false} options={{headerShown: false}} 
                    />
                    <Stack.Screen
                        name="Music"
                        component={musicScreen}
                        initial={false} 
                        options={{headerTitleAlign: 'center'}}
                    />
                    <Stack.Screen
                        name="Activity Setup"
                        component={activitySetup}
                        initial={false} 
                        options={{headerTitleAlign: 'center'}}
                    />
                    <Stack.Screen
                        name="addRouteScreen"
                        component={addRouteScreen}
                        initial={false} 
                        options={{headerTitleAlign: 'center'}}
                    />
                    <Stack.Screen
                        name="editProfileScreen"
                        component={editProfileScreen}
                        initial={false} 
                        options={{headerTitleAlign: 'center', title: 'Edit Profile'}}
                    />  
                    <Stack.Screen
                        name="eventsScreen"
                        component={eventsScreen}
                        initial={false} 
                        options={{headerTitleAlign: 'center', title: 'Featured Events'}}
                    /> 
                    <Stack.Screen
                        name="upcomingEventsScreen"
                        component={upcomingEventsScreen}
                        initial={false} 
                        options={{headerTitleAlign: 'center', title: 'Upcoming Events'}}
                    /> 
                    <Stack.Screen
                        name="activityHistoryScreen"
                        component={activityHistoryScreen}
                        initial={false} 
                        options={{headerTitleAlign: 'center', title: 'History'}}
                    /> 
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

