import axios from 'axios';

const API_BASE_URL = 'https://api.opentransport.ro/gtfs/v1';

export const fetchStops = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stop`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stops:', error);
    throw error;
  }
};

export const fetchNearbyStops = async (latitude, longitude, radius) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stop/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby stops:', error);
      throw error;
    }
  };

export const fetchRoutes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/route`);
      return response.data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  };

export const fetchRoutesWithShapes = async (filter) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/route/${filter}?include=shape`);
      return response.data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  };

export const fetchRoutesWithStops = async (filter) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/route/${filter}?include=stop`);
      return response.data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  };