import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WelcomeScreen from '../components/welcome';
import LoginScreen from '../customer/clogin';
import SignUpScreen from '../customer/csignup';
import Home from '../customer/chome';
import Userprofile from '../customer/userprofile'
import SLoginScreen from '../seller/slogin';
import Sellersignup from '../seller/sellersignup';
import Sellerhome from '../seller/sellerhome';
import SellerProfile from '../seller/Sellerprofile';
// Testing right now 
import ListYourItemScreen from '../seller/LisitingScreen';
import TestScreeen from '../customer/TestScreen';
import YourItemScreen from '../seller/YourItemsScreen';
import EditItemScreen from '../seller/EditItemScreen';
import BuyScreen from '../customer/BuyScreen';
import QuickViewScreen from '../customer/Quickview';
import CartScreen from '../customer/Cart';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="welcome" options={{ headerShown: false }} >
            <Stack.Screen name="welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name='TabNavigator' component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name='Userprofile' component={Userprofile} options={{ headerShown: false }} />
            <Stack.Screen name='SLogin' component={SLoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name='SellerSignup' component={Sellersignup} options={{ headerShown: false }} />
            <Stack.Screen name='SellerHome' component={Sellerhome} options={{ headerShown: false }} />
            <Stack.Screen name='SellerTabNavigator' component={SellerTabNavigator} options={{ headerShown: false }} />
            {/* testing */}
            <Stack.Screen name='Test' component={TestScreeen} options={{ headerShown: false }} />
            <Stack.Screen name='YourItem' component={YourItemScreen} options={{ headerShown: false }} />
            <Stack.Screen name='ListYourItem' component={ListYourItemScreen} options={{ headerShown: false }} />
            <Stack.Screen name='EditItemScreen' component={EditItemScreen} options={{ headerShown: false }} />
            <Stack.Screen name='BuyScreen' component={BuyScreen} options={{ headerShown: false }} />
            {/* <Stack.Screen name='QuickViewScreen' component={QuickViewScreen} options={{ headerShown: false }} /> */}
            <Stack.Screen name='CartScreen' component={CartScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};


export const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarLabelStyle: { marginBottom: 5, fontSize: 14, fontWeight: '700' },
                tabBarStyle: { marginBottom: 0, marginTop: 0 }, // Set marginTop to 0
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Userprofile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-sharp';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
            initialRouteName='Home'
        >
            <Tab.Screen options={{ headerShown: false }} name='Home' component={Home}></Tab.Screen>
            <Tab.Screen options={{ headerShown: false }} name='Userprofile' component={Userprofile}></Tab.Screen>
            {/* Testinig for now */}
            <Tab.Screen options={{ headerShown: false }} name='Test' component={TestScreeen}></Tab.Screen>
        </Tab.Navigator>
    );
};
export const SellerTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarLabelStyle: { marginBottom: 5, fontSize: 14, fontWeight: '700' },
                tabBarStyle: { marginBottom: 0, marginTop: 0 }, // Set marginTop to 0
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'SellerProfile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'SellerHome') {
                        iconName = focused ? 'home' : 'home-sharp';
                    } else if (route.name === 'ListYourItem') {
                        iconName = focused ? 'list' : 'list-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
            initialRouteName='SellerHome'
        >
            <Tab.Screen options={{ headerShown: false }} name='SellerHome' component={Sellerhome}></Tab.Screen>
            <Tab.Screen options={{ headerShown: false }} name='SellerProfile' component={SellerProfile}></Tab.Screen>
            {/* Testing for now */}
            <Tab.Screen options={{ headerShown: false }} name='ListYourItem' component={ListYourItemScreen}></Tab.Screen>
            <Tab.Screen options={{ headerShown: false }} name='YourItem' component={YourItemScreen}></Tab.Screen>
        </Tab.Navigator>
    );
};

export default AppNavigator;
