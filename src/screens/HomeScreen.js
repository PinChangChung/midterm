import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { Center, Box, VStack, HStack, Text, Image } from "@gluestack-ui/themed";

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

const HomeScreen = () => {
  const { navigate } = useNavigation();

  const [nearpot, setNearpot] = useState([]);


  const [msg, setMsg] = useState("Waiting...");
  const [onCurrentLocation, setOnCurrentLocation] = useState(false);
  const [ubike, setUbike] = useState([]);
  const [zoomRatio, setZoomRatio] = useState(1);

  const [screenSites, setScreenSites] = useState([]);

  const [toggleMap, setToggleMap] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);


  //setToggleMap = () => toggleMap = !toggleMap;


  const [region, setRegion] = useState({
    longitude: 121.544637,
    latitude: 25.024624,
    longitudeDelta: 0.0015,
    latitudeDelta: 0.0015,
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

  useEffect(() => {
    getLocation();
    setNearpot(distanceMinSite);
  }, [ubike, screenSite]);

  const distanceMinSite = ubike.filter((site) => {
    if (Math.abs(site.lat - region.latitude) < 0.0005 &&
      Math.abs(site.lng - region.longitude) < 0.0005) {
      return site;
    }

  })

  useEffect(() => {
    getLocation();
    getUbikeData();
  }, []);

  const screenSite = ubike.filter((site) => {
    if (Math.abs(site.lat - region.latitude) < 0.0025 &&
      Math.abs(site.lng - region.longitude) < 0.0025) {
      return site;
    }
  })

  const colorMode = useSelector(selectColorMode);
  const textMode = colorMode == "light" ? "#000" : "#E2DDDD";
  const blockMode = colorMode == "light" ? "#FAFAFA" : "#474747";


  return (
    <ScrollView style={{ flex: 1, height: "100%" }} >
      <Center bg={colorMode == "light" ? "#FFE27B" : "#2E251B"}>
        <VStack>
          <HStack>
            <Center w={"100%"}>
              <Box bg={blockMode} h={240} w={"90%"} borderRadius={17}>
                <Center h={"85%"}>
                  <VStack mt={20}>
                    <HStack mb={10} mt={-20} h={90} justifyContent="center" alignItems="center">
                      <Text paddingHorizontal={15} fontSize={18} color={textMode}>
                        離您最近的站點：<Text fontWeight="bold" fontSize={20} color={textMode}>{nearpot.map((site) => {
                          return site.sna
                        })}</Text>
                      </Text>
                    </HStack>
                    <HStack h={50} justifyContent="center" alignItems="center" mt={22}>
                      <Box mt={5} bg="#D9D9D9" h={110} w={157}>
                        <Box flex={1}>
                          <MapView
                            initialRegion={region}
                            style={{ height: "100%", width: "100%" }}
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
                                <Center
                                  bg="white"
                                  borderRadius={60}
                                  p={3 * zoomRatio}
                                  borderWidth={2 * zoomRatio}
                                  borderColor="#F29D38"
                                >
                                  <Icon name={"bicycle"} size={30 * zoomRatio} color="#F29D38" />
                                </Center>
                              </Marker>
                            ))}
                          </MapView>
                        </Box>
                      </Box>
                      <VStack ml={20}>
                        <Text color={textMode}>
                          空柱：{nearpot.map((site) => {
                            return site.bemp
                          })}
                        </Text>
                        <Text color={textMode}>
                          可借車輛：{nearpot.map((site) => {
                            return site.sbi
                          })}
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>

                </Center>
              </Box>
            </Center>
          </HStack>
          <HStack>
            <Center w={"100%"} mt={10}>
              <Box bg={blockMode} h={150} w={"90%"} borderRadius={17}>
                <HStack h={"100%"} justifyContent="center" alignItems="center">
                  <HStack mr={25} h={70} justifyContent="center" alignItems="center">
                    <MaterialCommunityIcons name="weather-partly-cloudy" size={70} color={"#F29D38"} />
                  </HStack>
                  <VStack>
                    <Text fontWeight="bold" fontSize={20} pb={5} color={textMode}>
                      大安區
                    </Text>
                    <Text pb={2} color={textMode}>
                      晴時有雲
                    </Text>
                    <Text pb={10} color={textMode}>
                      30°C
                    </Text>
                    <HStack>
                      <MaterialCommunityIcons name="weather-pouring" size={22} color={"#F29D38"} />
                      <Text pl={3} pb={5} color={textMode}>
                        降雨機率：2%
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
              </Box>
            </Center>
          </HStack>
          <HStack w={"100%"} h={125} space="lg" justifyContent="center" marginVertical={22}>
            <Box w={"36%"} h={"100%"} bg={blockMode} borderRadius={20} style={styles.shadow}>
              <TouchableOpacity onPress={() => navigate("Near")}>
                <VStack h={"100%"} justifyContent="center" alignItems="center">
                  <MaterialCommunityIcons name="map-marker" size={55} color={"#5686E1"} />
                  <Text color={"#5686E1"}>
                    附近站點
                  </Text>
                </VStack>
              </TouchableOpacity>
            </Box>
            <Box w={"36%"} h={"100%"} bg={blockMode} borderRadius={20} style={styles.shadow}>
              <TouchableOpacity onPress={() => navigate("Favorite")}>
                <VStack h={"100%"} justifyContent="center" alignItems="center">
                  <MaterialCommunityIcons name="heart" size={55} color={"#EB3223"} />
                  <Text color={"#EB3223"}>
                    最愛站點
                  </Text>
                </VStack>
              </TouchableOpacity>
            </Box>
          </HStack>
          <HStack w={"100%"} h={125} space="lg" justifyContent="center" marginBottom={10}>
            <Box w={"36%"} h={"100%"} bg={blockMode} borderRadius={20} style={styles.shadow}>
              <TouchableOpacity onPress={() => navigate("Map")}>
                <VStack h={"100%"} justifyContent="center" alignItems="center">
                  <MaterialCommunityIcons name="map" size={55} color={"#56D665"} />
                  <Text color={"#56D665"}>
                    站點地圖
                  </Text>
                </VStack>
              </TouchableOpacity>
            </Box>
            <Box w={"36%"} h={"100%"} bg={blockMode} borderRadius={20} style={styles.shadow}>
              <TouchableOpacity onPress={() => navigate("Route")}>
                <VStack h={"100%"} justifyContent="center" alignItems="center">
                  <MaterialCommunityIcons name="bicycle" size={55} color={"#F29D38"} />
                  <Text color={"#F29D38"}>
                    騎乘路線
                  </Text>
                </VStack>
              </TouchableOpacity>
            </Box>
          </HStack>
        </VStack>
      </Center>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 2,
    shadowRadius: 1.5,
    elevation: 4,
  }
})

export default HomeScreen;
