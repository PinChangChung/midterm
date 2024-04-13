import React from 'react';

import { useNavigation } from "@react-navigation/native";

import { View, TextInput, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Center, Box, VStack, Text, InputField, Input } from "@gluestack-ui/themed";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useDispatch } from "react-redux";
import { login } from "../redux/slice";
import { useSelector } from "react-redux";
import { selectColorMode } from "../redux/slice";

const LoginScreen = () => {

    const dispatch = useDispatch();

    const { navigate } = useNavigation();

    const colorMode = useSelector(selectColorMode);
    const headerMode = colorMode == "light" ? "#FFE27B" : "#2E251B";
    const textMode = colorMode == "light" ? "#000" : "#E2DDDD";
    const blockMode = colorMode == "light" ? "#FAFAFA" : "#474747";

    return (
        <>
            <Box bg={colorMode == "light" ? "#FFE27B" : "#2E251B"} style={{ flex: 1, height: "100%" }}>
                <ScrollView>
                    <VStack>
                        <Box h={250} justifyContent='flex-end' alignItems='center' pb={20}>
                            <MaterialCommunityIcons name="account-circle" size={100} />
                        </Box>
                        <Center>
                            <Input style={styles.input} bg={blockMode}>
                                <View className="rounded-full">
                                    <Box h={"100%"} justifyContent="center" >
                                        <InputField
                                            placeholder="信箱"
                                            placeholderTextColor={textMode}
                                            style={styles.searchtext}
                                            w={270}
                                        />

                                    </Box>
                                </View>
                            </Input>
                            <Input style={styles.input} bg={blockMode}>
                                <View className="rounded-full">
                                    <Box h={"100%"} justifyContent="center" >
                                        <InputField
                                            placeholder="密碼"
                                            placeholderTextColor={textMode}
                                            style={styles.searchtext}
                                            w={270}
                                        />
                                    </Box>
                                </View>
                            </Input>
                            <TouchableOpacity style={styles.loginAction} onPress={() => dispatch(login())}>
                                <Center className="rounded-full">
                                    <Box h={"100%"} justifyContent="center" >
                                        <Text color='#fff'>登入</Text>
                                    </Box>
                                </Center>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Text style={styles.tiptext}>
                                    忘記密碼
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigate("RegisterScreen")}>
                                <Text style={styles.tiptext}>
                                    尚無帳號？註冊
                                </Text>
                            </TouchableOpacity>
                        </Center>
                    </VStack>
                </ScrollView>
            </Box>
        </>

    )
}

const styles = StyleSheet.create({
    input: {
        height: 47,
        width: '80%',
        borderRadius: 50,
        marginBottom: 6,
        marginTop: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 2,
        shadowRadius: 1.5,
        elevation: 4,
    },
    searchtext: {
        marginLeft: 15,
        marginTop: 0,
        fontSize: 15,
        opacity: 0.5
    },
    tiptext: {
        marginLeft: 0,
        marginTop: 17,
        fontSize: 13,
        color: "#B76E18",
    },
    loginAction: {
        height: 47,
        width: '80%',
        backgroundColor: '#F29D38',
        borderRadius: 50,
        marginBottom: 13,
        marginTop: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 2,
        shadowRadius: 1.5,
        elevation: 4,
    }
})

export default LoginScreen;