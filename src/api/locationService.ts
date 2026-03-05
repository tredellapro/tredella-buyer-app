import apiClient from "./client";
import { ApiResponse } from "@/types/api";

export interface Country {
  id: string;
  code: string;
  name: string;
  phoneCode: string;
  flag: string;
  currency: string;
  has_states: boolean;
}

export interface State {
  id: string;
  name: string;
  code: string;
  countryCode: string;
  has_cities: boolean;
}

export interface City {
  id: string;
  name: string;
  stateCode: string;
  countryCode: string;
  latitude: string;
  longitude: string;
}

export const locationService = {
  getCountries: async () => {
    const response = await apiClient.get<ApiResponse<Country[]>>(
      "/location/countries",
    );
    return response.data;
  },

  getStates: async (countryCode: string) => {
    const response = await apiClient.get<ApiResponse<State[]>>(
      `/location/states/${countryCode}`,
    );
    return response.data;
  },

  getCities: async (countryCode: string, stateCode: string) => {
    const response = await apiClient.get<ApiResponse<City[]>>(
      `/location/cities/${countryCode}/${stateCode}`,
    );
    return response.data;
  },
};
