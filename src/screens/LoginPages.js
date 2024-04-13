import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Pressable } from "react-native";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';


const Stack = createNativeStackNavigator();

import { useSelector } from "react-redux";
import { selectColorMode } from "../redux/slice";


const LoginPages = () => {

    const colorMode = useSelector(selectColorMode);
    const headerMode = colorMode == "light" ? "#FFE27B" : "#2E251B";
    const textMode = colorMode == "light" ? "#000" : "#E2DDDD";

    return (
        <Stack.Navigator
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: headerMode
                }
            }}
        >
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{
                    title: "",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options={
                    ({ navigation }) => (
                        {
                            title: "   註冊",
                            headerShown: "true",
                            headerTintColor: textMode,
                            headerTitleStyle: {
                                fontSize: 15
                            },
                            headerLeft: () => (
                                <Pressable onPress={() => navigation.goBack()}>
                                    <MaterialCommunityIcons
                                        name={'chevron-left'}
                                        size={30}
                                        color={'#F29D38'}
                                    />
                                </Pressable>
                            )
                        }
                    )
                }
            />
        </Stack.Navigator>
    );
}

export default LoginPages;