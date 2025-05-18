import axios from 'axios';
import type { Dog, Location, Match, SearchParams, SearchResponse, LocationSearchResponse } from '../types';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Add request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for logging
api.interceptors.response.use(
    (response) => {
        console.log('Received response from:', response.config.url);
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const dogService = {
    login: async (name: string, email: string) => {
        try {
            const response = await api.post('/auth/login', { name, email });
            console.log('Login successful');
            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
            console.log('Logout successful');
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    },

    getBreeds: async (): Promise<string[]> => {
        try {
            const response = await api.get('/dogs/breeds');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch breeds:', error);
            throw error;
        }
    },

    searchDogs: async (params: SearchParams): Promise<SearchResponse> => {
        try {
            const response = await api.get('/dogs/search', { params });
            return response.data;
        } catch (error) {
            console.error('Failed to search dogs:', error);
            throw error;
        }
    },

    getDogs: async (dogIds: string[]): Promise<Dog[]> => {
        try {
            const response = await api.post('/dogs', dogIds);
            return response.data;
        } catch (error) {
            console.error('Failed to get dogs:', error);
            throw error;
        }
    },

    getMatch: async (dogIds: string[]): Promise<Match> => {
        try {
            const response = await api.post('/dogs/match', dogIds);
            return response.data;
        } catch (error) {
            console.error('Failed to get match:', error);
            throw error;
        }
    },

    getLocations: async (zipCodes: string[]): Promise<Location[]> => {
        try {
            const response = await api.post('/locations', zipCodes);
            return response.data;
        } catch (error) {
            console.error('Failed to get locations:', error);
            throw error;
        }
    },

    searchLocations: async (params: any): Promise<LocationSearchResponse> => {
        try {
            const response = await api.post('/locations/search', params);
            return response.data;
        } catch (error) {
            console.error('Failed to search locations:', error);
            throw error;
        }
    },
}; 