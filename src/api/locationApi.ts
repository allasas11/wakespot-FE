import axios from 'axios'
import { Location } from '../types/types'
import { API_URL } from '../utils/config';


export const fetchLocations = async (): Promise<Location[]> => {
    try {
        const response = await axios.get<Location[]>(`${API_URL}/locations`);
        return response.data;
    } catch (error) {
        console.error('Error fetching locations:', error)
        throw error
    }
}

export const fetchLocationById = async (id: number): Promise<Location> => {
    try {
        const response = await axios.get<Location>(`${API_URL}/locations/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching customer with ID ${id}:`, error);
        throw error;
    }
};
