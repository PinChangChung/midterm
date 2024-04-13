import React from "react";
import { ScrollView } from "react-native";
import { Center, Box, VStack, HStack, Text, Switch, Image } from "@gluestack-ui/themed";
import { useDispatch, useSelector, Provider } from "react-redux";
import { selectColorMode } from "../redux/slice";
import { toggleColorMode } from "../redux/slice";

const ModeScreen = () => {

  const colorMode = useSelector(selectColorMode);
  const textMode = colorMode == "light" ? "#000" : "#E2DDDD";
  const blockMode = colorMode == "light" ? "#FAFAFA" : "#474747";

  const dispatch = useDispatch();

  return (
    <Box flex={1} bg={colorMode == "light" ? "#FFE27B" : "#2E251B"}>
      <ScrollView>
        <Center
          shadow={2} width="90%"
          mt="$2" px="$2" py="$4"
          bg={blockMode} borderRadius={3}
          alignSelf="center"
        >
          <HStack space={8} alignItems="center" >
            <Text color={textMode} size="lg" px="$2">深淺模式：{colorMode == "light" ? "淺" : "深"}</Text>
            <Switch
              name="light Mode"
              size='md'
              accessibilityLabel="display-mode"
              accessibilityHint="light or dark mode"
              value={colorMode === "dark"}
              onToggle={() => dispatch(toggleColorMode())}
            />
          </HStack>
        </Center>
        <HStack w={"100%"} justifyContent="space-between" mt={30}>
          <Box w={"40%"} h={400} ml={30} >
            <Text color={textMode} mb={10}> 淺色模式預覽</Text>
            <Image w={"100%"} h={"100%"} source={require("../../midterm_img/螢幕擷取畫面 2024-04-13 143318.png")} alt="淺色版面預覽" />
          </Box>
          <Box w={"40%"} h={400} mr={30}>
            <Text color={textMode} mb={10}> 深色模式預覽</Text>
            <Image w={"100%"} h={"100%"} source={require("../../midterm_img/螢幕擷取畫面 2024-04-13 142719.png")} alt="深色版面預覽" />
          </Box>
        </HStack>
      </ScrollView>

    </Box>
  );
};

export default ModeScreen;
