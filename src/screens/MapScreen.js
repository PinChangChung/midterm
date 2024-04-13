import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, TextInput } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { Platform } from "react-native";
import { Box, Center, HStack, Input, InputField } from '@gluestack-ui/themed';
import * as Location from 'expo-location';
import * as Device from "expo-device";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getUbikeInfo } from '../api';
import ActionButton from '../components/ActionButton';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useSelector } from "react-redux";
import { selectColorMode } from "../redux/slice";

import lightMap from "../mapStyle_json/lightMode.json"
import darkMap from "../mapStyle_json/darkMode.json"


export default function MapScreen() {
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
      //let location = await Location.getCurrentPositionAsync({});

      Location.watchPositionAsync(
         {
            accuracy: Location.Accuracy.High,
            distanceInterval: 2000,
            timeInterval: 1000,
         },
         (loc) => setRegionAndMarker(loc)
      );

      // setRegionAndMarker(location);
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

   useEffect(() => {
      getLocation();
   }, [ubike]);

   const screenSite = ubike.filter((site) => {
      if (Math.abs(site.lat - region.latitude) < 0.005 &&
         Math.abs(site.lng - region.longitude) < 0.005) {
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
      <Box flex={1}>
         <Center w={"100%"} h={"15%"} bg={colorMode == "light" ? "#FFE27B" : "#2E251B"}>
            <Input style={styles.searchbar} bg={blockMode}>
               <HStack justifyContent='space-between'>
                  <Box className="rounded-full" w={"83%"}>
                     <Box h={"100%"} justifyContent="center" >
                        <InputField
                           placeholder="搜尋站點"
                           placeholderTextColor={textMode}
                           style={styles.searchtext}
                           value={searchText}
                           onChangeText={(text) => {
                              setSearchText(text);
                           }}
                        />
                     </Box>
                  </Box>
                  <TouchableOpacity onPress={search}>
                     <Center h={"100%"} w={40} mr={10}>
                        <MaterialCommunityIcons name="magnify" size={38} color={'#F29D38'} />
                     </Center>
                  </TouchableOpacity>
               </HStack>
            </Input>
         </Center>

         <MapView
            initialRegion={region}
            style={{ height: "85%", width: "100%" }}
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
   );
}

const styles = StyleSheet.create({
   searchbar: {
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