import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Constants from "expo-constants/src/Constants";

const API_KEY = Constants.expoConfig.extra.nasaApiKey;

export default function App() {
  const [asteroidId, setAsteroidId] = useState('');
  const [asteroidData, setAsteroidData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAsteroidData = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${API_KEY}`);
      setAsteroidData(response.data);
    } catch (error) {
      console.error('Error fetching asteroid data:', error);
      alert('Asteroid ID not found');
    }
    setLoading(false);
  };

  const fetchRandomAsteroid = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${API_KEY}`);
      const randomAsteroid = response.data.near_earth_objects[Math.floor(Math.random() * response.data.near_earth_objects.length)];
      await fetchAsteroidData(randomAsteroid.id);
    } catch (error) {
      console.error('Error fetching random asteroid:', error);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetchAsteroidData(asteroidId);
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>NASA Asteroid Lookup</Text>

        <TextInput
            style={styles.input}
            placeholder="Enter Asteroid ID Here To Search"
            value={asteroidId}
            onChangeText={setAsteroidId}
        />

        <TouchableOpacity
            style={[styles.button, asteroidId ? styles.buttonEnabled : styles.buttonDisabled]}
            onPress={handleSearch}
            disabled={!asteroidId}
        >
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={fetchRandomAsteroid}>
          <Text style={styles.buttonText}>Random Asteroid</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#00ff00" />}

        {asteroidData && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>Name: {asteroidData.name}</Text>
              <Text style={styles.resultText}>NASA JPL URL: {asteroidData.nasa_jpl_url}</Text>
              <Text style={styles.resultText}>
                Potentially Hazardous: {asteroidData.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
              </Text>
            </View>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    margin: 5,
    width: '80%',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonDisabled: {
    backgroundColor: '#a5a5a5',
  },
  buttonEnabled: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
