import React from "react";
import { View, TextInput, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Center, Box, VStack, HStack, Image, Text } from "@gluestack-ui/themed";

import { useNavigation } from "@react-navigation/native";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Platform } from "react-native";
import * as Location from 'expo-location';
import * as Device from "expo-device";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getUbikeInfo } from '../api';
import ActionButton from '../components/ActionButton';

import { useSelector } from "react-redux";
import { selectColorMode } from "../redux/slice";

import lightMap from "../mapStyle_json/lightMode.json"
import darkMap from "../mapStyle_json/darkMode.json"

const Favorite = () => {
  const { navigate } = useNavigation();

  const [msg, setMsg] = useState("Waiting...");
  const [onCurrentLocation, setOnCurrentLocation] = useState(false);
  const [ubike, setUbike] = useState([]);
  const [zoomRatio, setZoomRatio] = useState(1);

  const [screenSites, setScreenSites] = useState([]);

  const [region, setRegion] = useState({
    longitude: 121.544637,
    latitude: 25.024624,
    longitudeDelta: 0.002,
    latitudeDelta: 0.004,
  })

  const [marker, setMarker] = useState({
    coord: {
      longitude: 121.544637,
      latitude: 25.024624,
    }
  });

  const setRegionAndMarker = (location) => {
    setRegion({
      ...region,
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    });
    setMarker({
      ...marker,
      coord: {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      },
    });
    setScreenSites(screenSite);
  };

  const onRegionChangeComplete = (rgn) => {
    setOnCurrentLocation(false);
    if (
      Math.abs(rgn.latitude - region.latitude) > 0.0004 ||
      Math.abs(rgn.longitude - region.longitude) > 0.0004
    ) {
      setRegion(rgn);
    }
    if (rgn.longitudeDelta > 0.02)
      setZoomRatio(0.02 / rgn.longitudeDelta);
    else
      setZoomRatio(1);
  }

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setMsg('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setRegionAndMarker(location);
    setOnCurrentLocation(true);
  }

  const getUbikeData = async () => {
    const ubikeData = await getUbikeInfo();
    setUbike(ubikeData);
  };

  // const distanceMinSite = () => {

  //    for (let index = 0; index < screenSites.length; index++) {
  //       if (index + 1 < screenSites.length) {
  //          if ((((screenSites[index].lat - region.latitude) ^ 2 + (screenSites[index].lng - region.longitude) ^ 2) ^ 0.5) <
  //             (((screenSites[index + 1].lat - region.latitude) ^ 2 + (screenSites[index + 1].lng - region.longitude) ^ 2) ^ 0.5)) {
  //             setScreenSites(screenSites[index].push("min"))
  //          }
  //       }
  //    }
  // }

  // let nearest = screenSites.indexOf("min") == null ? null : screenSites.indexOf("min");

  useEffect(() => {
    getLocation();
    getUbikeData();
  }, []);

  const screenSite = ubike.filter((site) => {
    if (Math.abs(site.lat - region.latitude) < 0.0021 &&
      Math.abs(site.lng - region.longitude) < 0.0021) {
      return site;
    }
  })

  const [searchText, setSearchText] = useState("")
  const search = () => ubike.filter((site) => {
    if (site.sna == searchText) {
      console.log(site);
    }
  })

  const colorMode = useSelector(selectColorMode);
  const textMode = colorMode == "light" ? "#000" : "#E2DDDD";
  const blockMode = colorMode == "light" ? "#FAFAFA" : "#474747";

  return (
    <ScrollView style={{ flex: 1, height: "100%" }} >

      <Box flex={1} h={"100%"} w={"100%"}>
        <MapView
          initialRegion={region}
          style={{ height: 350, width: "100%" }}
          onRegionChangeComplete={onRegionChangeComplete}
          customMapStyle={colorMode == "light" ? lightMap : darkMap}
        >
          <Marker
            coordinate={marker.coord}
          >
            <Icon name={"map-marker"} size={60} color="#B12A5B" />
          </Marker>
          {(zoomRatio > 0.14) && screenSites.map((site) => (
            <Marker
              coordinate={{
                latitude: Number(site.lat),
                longitude: Number(site.lng),
              }}
              key={site.sno}
              title={`${site.sna} ${site.sbi}/${site.bemp}`}
              description={site.ar}
            >
              <ActionButton zoomRatio={zoomRatio} site={site} />
            </Marker>
          ))}
        </MapView>
        {!onCurrentLocation && (
          <Box
            bg="white"
            borderRadius={60}
            h={60}
            w={60}
            position="absolute"
            shadow="2"
            zIndex={99}
            right={5}
            bottom={70}
            pt={4}
            opacity={0.8}
          >
            <Center>
              <TouchableOpacity onPress={getLocation}>
                <Ionicons name={"locate-outline"}
                  size={50}
                  color="#F29D38"
                />
              </TouchableOpacity>
            </Center>

          </Box>

        )}
      </Box>

      <Center bg={colorMode == "light" ? "#FFE27B" : "#2E251B"}>
        <VStack w={"100%"}>

          {(zoomRatio > 0.14) && (screenSites.map((site) => {
            <HStack w={"100%"} h={125} space="lg" justifyContent="center" marginTop={22}>
              <Box w={"80%"} h={"70%"} bg="#fff" borderRadius={20} style={styles.shadow}>
                <TouchableOpacity onPress={() => null}>
                  <VStack h={"100%"} justifyContent="center" pl={10}>
                    <HStack>
                      <MaterialCommunityIcons name="heart" size={40} color={"red"} />
                      <Text>
                        {`${site.sna}`}
                      </Text>
                    </HStack>

                  </VStack>
                </TouchableOpacity>
              </Box>
            </HStack>
          }))}
          <HStack w={"100%"} h={125} space="lg" justifyContent="center" marginTop={22}>
            <Box w={"80%"} h={"70%"} bg={blockMode} borderRadius={20} style={styles.shadow}>
              <TouchableOpacity onPress={() => null}>
                <VStack h={"100%"} justifyContent="center" pl={10}>
                  <HStack>
                    <MaterialCommunityIcons name="heart" size={40} color={"red"} />
                    <Text ml={20} lineHeight={40} color={textMode}>
                      404 Not Found
                    </Text>
                  </HStack>

                </VStack>
              </TouchableOpacity>
            </Box>
          </HStack>

          <HStack w={"100%"} h={125} space="lg" justifyContent="center" marginVertical={-30}>
            <Box w={"80%"} h={"70%"} bg={blockMode} borderRadius={20} style={styles.shadow}>
              <TouchableOpacity onPress={() => null}>
                <VStack h={"100%"} justifyContent="center" pl={10}>
                  <HStack>
                    <MaterialCommunityIcons name="heart" size={40} color={"red"} />
                    <Text ml={20} lineHeight={40} color={textMode}>
                      404 Not Found
                    </Text>
                  </HStack>
                </VStack>
              </TouchableOpacity>
            </Box>
          </HStack>
          <HStack w={"100%"} h={125} space="lg" justifyContent="center" marginVertical={0}>
            <Box w={"80%"} h={"70%"} bg={blockMode} borderRadius={20} style={styles.shadow}>
              <TouchableOpacity onPress={() => null}>
                <VStack h={"100%"} justifyContent="center" pl={10}>
                  <HStack>
                    <MaterialCommunityIcons name="heart" size={40} color={"red"} />
                    <Text ml={20} lineHeight={40} color={textMode}>
                      404 Not Found
                    </Text>
                  </HStack>
                </VStack>
              </TouchableOpacity>
            </Box>
          </HStack>
          <HStack w={"100%"} h={125} space="lg" justifyContent="center" marginVertical={-30}>
            <Box w={"80%"} h={"70%"} bg={blockMode} borderRadius={20} style={styles.shadow}>
              <TouchableOpacity onPress={() => null}>
                <VStack h={"100%"} justifyContent="center" pl={10}>
                  <HStack>
                    <MaterialCommunityIcons name="heart" size={40} color={"red"} />
                    <Text ml={20} lineHeight={40} color={textMode}>
                      404 Not Found
                    </Text>
                  </HStack>
                </VStack>
              </TouchableOpacity>
            </Box>
          </HStack>
          <HStack w={"100%"} h={125} space="lg" justifyContent="center" marginVertical={0}>
            <Box w={"80%"} h={"70%"} bg={blockMode} borderRadius={20} style={styles.shadow}>
              <TouchableOpacity onPress={() => null}>
                <VStack h={"100%"} justifyContent="center" pl={10}>
                  <HStack>
                    <MaterialCommunityIcons name="heart" size={40} color={"red"} />
                    <Text ml={20} lineHeight={40} color={textMode}>
                      404 Not Found
                    </Text>
                  </HStack>
                </VStack>
              </TouchableOpacity>
            </Box>
          </HStack>
        </VStack>
      </Center>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 2,
    shadowRadius: 1.5,
    elevation: 4,
  },
  searchbar: {
    height: 65,
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 50,
    marginBottom: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 2,
    shadowRadius: 1.5,
    elevation: 4,
  },
  searchtext: {
    marginLeft: 15,
    marginTop: 5,
    fontSize: 15,
  },
  magnify: {
    marginTop: -30,
    marginLeft: '80%'
  }
})

export default Favorite;
