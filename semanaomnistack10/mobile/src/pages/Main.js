import React, {useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import  MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import  { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';
import {connect, disconnect, subscribeToNewDevs} from '../services/socket'

function Main({ navigation }) {

  const [devs, setDevs] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [tecno, setTecno] = useState('');


  useEffect (() => {

    async function loadInitialPosition() {
    const { granted } =  await requestPermissionsAsync();

    if (granted) {
      const {coords} = await getCurrentPositionAsync({
        enableHighAcurracy: true,
      });
        const {latitude, longitude} = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.10,
          longitudeDelta: 0.10,
        })


    }
    }
    loadInitialPosition();
  }, []);

  useEffect (() => {
    subscribeToNewDevs(dev => setDevs([...devs, dev]));
  }, [devs]);

  function setupWebsocket() {
    disconnect();

    const {latitude, longitude} = currentRegion;
  
    connect(
      latitude,
      longitude,
      tecno
    );


  }

    async function loadDevs() {
      const {latitude, longitude } = currentRegion;
    const response = await api.get('/search', {
      params: {
        latitude,
        longitude,
        tecno
      }
    });  

    setDevs(response.data.devs);
    setupWebsocket();
  }

  function handleRegionChanged(region) {
    
    setCurrentRegion(region);
  }

  if (!currentRegion) {
    return null;
  }


  return (
  <>
    <MapView
     onRegionChangeComplete={handleRegionChanged} 
     initialRegion={currentRegion} 
     style={styles.map}
     >

      {devs.map(dev => (
        <Marker 
        key={dev._id}
        coordinate={{

          longitude: dev.location.coordinates[0],
          latitude: dev.location.coordinates[1], 
          
        }}
      >

          <Image 
            style={styles.avatar} 
            source={{ uri: dev.avatar_url }}
          />
        
        <Callout onPress={() => {
          navigation.navigate('Profile', { github_username: dev.github_username });
        }}>

          <View style={styles.callout}>
            <Text style={styles.devName}>{dev.name}</Text>
            <Text style={styles.devBio}>{dev.bio}</Text>
            <Text style={styles.devTecno}>{dev.tecno.join(',')}</Text>
          </View>

        </Callout>
      
      </Marker>
      ))}
    </MapView>

    <View style={styles.searchForm}>
      <TextInput 
      style={styles.searchInput} 
      placeholder="Buscar devs por tecnologias..."
      placeholderTextColor='rgb(23, 191, 99)'
      autoCapitalize="words"
      autoCorrect={false}
      value={tecno}
      onChangeText={setTecno}
      />


    <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
      <MaterialIcons name="my-location" size={20} color="#000"/>
    </TouchableOpacity>
    </View>
  </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgb(23, 191, 99)',

  },

  callout: {
    width: 260,
  },

  devName: {
    fontWeight: "bold",
    fontSize: 16,
  },

  devBio: {
    color: '#fff',
    marginTop: 5,
  },

  devTecno: {
    marginTop: 5,
  },

  searchForm: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row',
  },

  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#000',
    color: '#3b3d3c',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation:2,
  },

  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgb(23, 191, 99)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,

  },
})


export default Main;
