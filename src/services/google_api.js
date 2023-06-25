import axios from 'axios';
import {GOOGLE_API_KEY} from '@env'

const API_BASE_URL = 'https://maps.googleapis.com/maps/api';

export const fetchDirectionsByPlaceId = async (origin, destination, mode, language) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/directions/json?origin=${origin}&destination=place_id:${destination.place_id}&mode=${mode}&language=${language}&key=${GOOGLE_API_KEY}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching directions:', error);
        throw error;
    }
};

export const fetchDirections = async (origin, destination, mode, language) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&language=${language}&key=${GOOGLE_API_KEY}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching directions:', error);
        throw error;
    }
};

export const fetchDistanceMatrix = async (destination, origin) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/distancematrix/json?destinations=${destination.latitude},${destination.longitude}&origins=${origin.latitude},${origin.longitude}&units=metric&key=${GOOGLE_API_KEY}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching directions:', error);
        throw error;
    }
}