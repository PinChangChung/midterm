import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Center, Box, VStack, HStack, Text, Divider } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { logout } from "../redux/slice";
import { selectGeneral } from "../redux/slice";
import { selectColorMode } from "../redux/slice";

import { useDispatch, useSelector } from "react-redux";

const AccountScreen = () => {
  const dispatch = useDispatch();

  const accountName = useSelector(selectGeneral);
  const defaultName = accountName.name == "" ? "使用者" : accountName.name;

  const colorMode = useSelector(selectColorMode);
  const titleTextMode = colorMode == "light" ? "#000" : "#E2DDDD";
  const textMode = colorMode == "light" ? "#F3A242" : "#E2DDDD";
  const blockMode = colorMode == "light" ? "#FAFAFA" : "#474747";
  const dividerMode =  colorMode == "light" ? "#F29D38" : "#E2DDDD";

  return (

      <ScrollView style={{ flex: 1, height: "100%" }}>
        <Box bg={colorMode == "light" ? "#FFE27B" : "#2E251B"}>
          <VStack>
            <Box h={120} justifyContent='center' alignItems='center' mt={30}>
              <MaterialCommunityIcons name="account-circle" size={80} />
            </Box>
            <Center h={30} w={"100%"} mb={30}>
              <Text fontSize={20} color={titleTextMode}>歡迎，{defaultName}</Text>
            </Center>
            <VStack w={"100%"} justifyContent="center" alignItems="center" >
              <TouchableOpacity style={styles.actionBotton} onPress={() => null}>
                <Box flex={1} bg={blockMode} borderRadius={8}>
                  <Center h={"100%"} alignItems="flex-start" ml={25}>
                    <HStack>
                      <MaterialCommunityIcons name="draw-pen" size={30} color={textMode} />
                      <Text color={textMode} fontSize={20} ml={8}>
                        修改會員資料
                      </Text>
                    </HStack>
                  </Center>
                </Box>

              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBotton} onPress={() => null}>
                <Box flex={1} bg={blockMode} borderRadius={8}>
                  <Center h={"100%"} alignItems="flex-start" ml={25}>
                    <HStack>
                      <MaterialCommunityIcons name="card-text" size={30} color={textMode} />
                      <Text color={textMode} fontSize={20} ml={8}>
                        綁定悠遊卡
                      </Text>
                    </HStack>
                  </Center>
                </Box>

              </TouchableOpacity>
            </VStack>

            <Box w={"100%"} alignItems="center" mt={10} mb={10}>
              <Divider backgroundColor={dividerMode} w={"90%"} />
            </Box >

            <VStack w={"100%"} justifyContent="center" alignItems="center">
              <TouchableOpacity style={styles.actionBotton} onPress={() => null}>
                <Box flex={1} bg={blockMode} borderRadius={8}>
                  <Center h={"100%"} alignItems="flex-start" ml={25}>
                    <HStack>
                      <MaterialCommunityIcons name="currency-usd" size={30} color={textMode} />
                      <Text color={textMode} fontSize={20} ml={8}>
                        收費方式
                      </Text>
                    </HStack>
                  </Center>
                </Box>

              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBotton} onPress={() => null}>
                <Box flex={1} bg={blockMode} borderRadius={8}>
                  <Center h={"100%"} alignItems="flex-start" ml={25}>
                    <HStack>
                      <MaterialCommunityIcons name="bicycle" size={30} color={textMode} />
                      <Text color={textMode} fontSize={20} ml={8}>
                        設備介紹
                      </Text>
                    </HStack>
                  </Center>
                </Box>

              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBotton} onPress={() => null}>
                <Box flex={1} bg={blockMode} borderRadius={8}>
                  <Center h={"100%"} alignItems="flex-start" ml={25}>
                    <HStack>
                      <MaterialCommunityIcons name="bike" size={30} color={textMode} />
                      <Text color={textMode} fontSize={20} ml={8}>
                        騎乘須知
                      </Text>
                    </HStack>
                  </Center>
                </Box>

              </TouchableOpacity>
            </VStack>



            <Box w={"100%"} alignItems="center" mt={10} mb={10}>
              <Divider backgroundColor={dividerMode} w={"90%"} />
            </Box>

            <VStack w={"100%"} justifyContent="center" alignItems="center" mb={40}>
              <TouchableOpacity style={styles.logoutBotton} onPress={() => dispatch(logout())}>
                <Center h={"100%"} alignItems="flex-start" ml={25}>
                  <HStack>
                    <MaterialCommunityIcons name="logout" size={30} color={"#fff"} />
                    <Text color="#fff" fontSize={20} ml={8}>
                      登出
                    </Text>
                  </HStack>
                </Center>
              </TouchableOpacity>
            </VStack>
          </VStack>
        </Box>


      </ScrollView>
  );
};

const styles = StyleSheet.create({
  actionBotton: {
    height: 55,
    width: "86%",
    borderRadius: 8,
    marginBottom: 6,
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 2,
    shadowRadius: 1.5,
    elevation: 4,
  },
  logoutBotton: {
    height: 55,
    width: "86%",
    backgroundColor: '#F29D38',
    borderRadius: 8,
    marginBottom: 6,
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 2,
    shadowRadius: 1.5,
    elevation: 4,
  }

})

export default AccountScreen;
