import axios from 'axios';
import { Dog, Location, Match, SearchParams, SearchResponse, LocationSearchResponse } from '../types';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const dogService = {
    login: async (name: string, email: string) => {
        await api.post('/auth/login', { name, email });
    },

    logout: async () => {
        await api.post('/auth/logout');
    },

    getBreeds: async (): Promise<string[]> => {
        const response = await api.get('/dogs/breeds');
        return response.data;
    },

    searchDogs: async (params: SearchParams): Promise<SearchResponse> => {
        const response = await api.get('/dogs/search', { params });
        return response.data;
    },

    getDogs: async (dogIds: string[]): Promise<Dog[]> => {
        const response = await api.post('/dogs', dogIds);
        return response.data;
    },

    getMatch: async (dogIds: string[]): Promise<Match> => {
        const response = await api.post('/dogs/match', dogIds);
        return response.data;
    },

    getLocations: async (zipCodes: string[]): Promise<Location[]> => {
        const response = await api.post('/locations', zipCodes);
        return response.data;
    },

    searchLocations: async (params: any): Promise<LocationSearchResponse> => {
        const response = await api.post('/locations/search', params);
        return response.data;
    },
}; 