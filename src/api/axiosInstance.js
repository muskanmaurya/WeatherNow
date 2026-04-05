import axios from 'axios';

export const weatherApi = axios.create({
    baseURL:"https://api.open-meteo.com/v1"
})

export const airQualityApi = axios.create({
    baseURL:"https://air-quality-api.open-meteo.com/v1"
})

