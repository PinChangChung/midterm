import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Pressable } from "react-native";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SettingScreen from './SettingScreen';
import ModeScreen from './ModeScreen'
import { useSelector } from "react-redux";
import { selectColorMode } from "../redux/slice";

const Stack = createNativeStackNavigator();

const SettingPages = ({ navigation }) => {

    const colorMode = useSelector(selectColorMode);
    const textMode = colorMode == "light" ? "#000" : "#E2DDDD";
    const headerMode = colorMode == "light" ? "#FFE27B" : "#2E251B";

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
                name="setting"
                component={SettingScreen}
                options={{
                    title: "設定",
                    headerTintColor: textMode,
                    headerTitleStyle: {
                        fontSize: 18
                    },
                    headerLeft: () => (
                        <MaterialCommunityIcons
                            name={'menu'}
                            size={30}
                            color={'#F29D38'}
                            onPress={() => navigation.openDrawer()}
                            style={{ marginRight: 20 }}
                        />
                    ),
                }}
            />
            <Stack.Screen
                name="mode"
                component={ModeScreen}
                options={
                    ({ navigation }) => (
                        {
                            title: "   深淺模式",
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

export default SettingPages;