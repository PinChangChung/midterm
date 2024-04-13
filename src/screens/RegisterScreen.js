import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Center, Box, VStack, Text } from "@gluestack-ui/themed";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
  AlertCircleIcon,
  Input,
  InputField,
} from "@gluestack-ui/themed";

import { setAccountInfo } from "../redux/slice";
import { selectGeneral } from "../redux/slice";
import { login } from "../redux/slice"
import { useDispatch, useSelector } from "react-redux";
import { selectColorMode } from "../redux/slice";


const RegisterScreen = () => {

  const general = useSelector(selectGeneral);
  const dispatch = useDispatch();
  const [name, setName] = useState(general.name);
  const [nameIsError, setNameIsError] = useState(true);
  const [email, setEmail] = useState(general.email);
  const [emailIsError, setEmailIsError] = useState(true);
  const [pw, setPw] = useState(general.pw);
  const [pwIsError, setPwIsError] = useState(true);
  const [checkpw, setCheckpw] = useState(general.checkpw);
  const [checkpwIsError, setCheckpwIsError] = useState(true);


  useEffect(() => {

    if (!nameIsError && !emailIsError && !pwIsError)
      dispatch(setAccountInfo({ name, email, pw, checkpw }))

    if (email.match(emailRegex)) setEmailIsError(false)
    else setEmailIsError(true);

    if (name.match(nameRegex)) setNameIsError(false)
    else setNameIsError(true);

    if (pw > 5) setPwIsError(false)
    else setPwIsError(true);

    if (checkpw === pw) setCheckpwIsError(false)
    else setCheckpwIsError(true);

  }, [name, email, pw, checkpw]);

  const nameRegex = /^\w+$/;
  const emailRegex = /\w{3,}@[a-zA-Z_]+\.[a-zA-Z]{2,5}/;
  const pwRegex = /\w{5,}/;

  const colorMode = useSelector(selectColorMode);
  const textMode = colorMode == "light" ? "#000" : "#E2DDDD";
  const blockMode = colorMode == "light" ? "#FAFAFA" : "#474747";

  return (
    <ScrollView style={{ flex: 1, height: "100%" }} >
      <VStack w={"100%"} bg={colorMode == "light" ? "#FFE27B" : "#2E251B"}>
        <Box h={120} justifyContent='center' alignItems='center' mt={30}>
          <MaterialCommunityIcons name="account-circle" size={80} />
        </Box>

        <Center>
          <Box w={"90%"}>
            <FormControl mb={5} isRequired w={"100%"}>
              <FormControlLabel ml={10}>
                <FormControlLabelText color={textMode}>帳號名稱</FormControlLabelText>
              </FormControlLabel>
              <Input style={styles.input} bg={blockMode}>
                <InputField
                  placeholder="輸入名稱"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (nameRegex.test(text)) setNameIsError(false);
                    else setNameIsError(true);
                  }}
                />
              </Input>
              <FormControlError isInvalid={nameIsError}>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  請輸入大小寫英文或數字
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl mb={5} isRequired w={"100%"}>
              <FormControlLabel ml={10}>
                <FormControlLabelText color={textMode}>輸入信箱</FormControlLabelText>
              </FormControlLabel>
              <Input style={styles.input} bg={blockMode}>
                <InputField
                  placeholder="請輸入您的google信箱"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailRegex.test(text)) setEmailIsError(false);
                    else setEmailIsError(true);
                  }}
                />
              </Input>
              <FormControlError isInvalid={emailIsError}>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  格式須為 abc@example.com
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl mb={5} isRequired w={"100%"}>
              <FormControlLabel ml={10}>
                <FormControlLabelText color={textMode}>密碼</FormControlLabelText>
              </FormControlLabel>
              <Input style={styles.input} bg={blockMode}>
                <InputField
                  placeholder="輸入密碼"
                  type="password"
                  value={pw}
                  onChangeText={(text) => {
                    setPw(text);
                    if (pwRegex.test(text)) setPwIsError(false);
                    else setPwIsError(true);
                  }}
                />
              </Input>
              <FormControlError isInvalid={pwIsError}>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  請至少輸入五個字元
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl mb={5} isRequired w={"100%"}>
              <FormControlLabel ml={10}>
                <FormControlLabelText color={textMode}>確認密碼</FormControlLabelText>
              </FormControlLabel>
              <Input style={styles.input} bg={blockMode}>
                <InputField
                  placeholder="再次輸入密碼"
                  type="password"
                  value={checkpw}
                  onChangeText={(text) => setCheckpw(text)}
                />
              </Input>
              <FormControlError isInvalid={checkpwIsError}>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  請輸入完全相同的密碼
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <Center>
              <TouchableOpacity style={styles.loginAction} onPress={() => dispatch(login())}>
                <Center className="rounded-full">
                  <Box h={"100%"} justifyContent="center" >
                    <Text color='#fff'>註冊</Text>
                  </Box>
                </Center>
              </TouchableOpacity>
            </Center>


          </Box>
        </Center>


      </VStack>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 45,
    width: "100%",
    borderRadius: 50,
    marginBottom: 5,
    marginTop: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 2,
    shadowRadius: 1.5,
    elevation: 4,
  },
  loginAction: {
    height: 55,
    width: "86%",
    backgroundColor: '#F29D38',
    borderRadius: 8,
    marginBottom: 30,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 2,
    shadowRadius: 1.5,
    elevation: 4,
  }
})

export default RegisterScreen;
