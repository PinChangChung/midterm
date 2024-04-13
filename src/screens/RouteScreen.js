import React from "react";
import { ScrollView } from "react-native";
import { Center, Box, VStack, HStack, Text } from "@gluestack-ui/themed";

import { useSelector } from "react-redux";
import { selectColorMode } from "../redux/slice";


const Route = () => {

  
const colorMode = useSelector(selectColorMode);
const textMode = colorMode == "light" ? "#000" : "#E2DDDD";
const blockMode = colorMode == "light" ? "#FAFAFA" : "#474747";

  return (
    <Box flex={1} bg={colorMode == "light" ? "#FFE27B" : "#2E251B"}>

    </Box>
  );
};

export default Route;
