import { useQuery } from '@tanstack/react-query';
import { fetchWeatherData, fetchAQIData, fetchWeatherArchiveData, fetchAQIArchiveData } from '../api/weatherApi';

export const useDashboardWeather = (latitude, longitude, selectedDate) => {
    // Only fetch if we have latitude, longitude, and a date
    const isReady = Boolean(latitude && longitude && selectedDate);

    const weatherQuery = useQuery({
        queryKey: ['weatherData', latitude, longitude, selectedDate],
        queryFn: () => fetchWeatherData(latitude, longitude, selectedDate),
        enabled: isReady,
        staleTime: 1000 * 60 * 5, // Wait 5 minutes before refetching
    });

    const aqiQuery = useQuery({
        queryKey: ['aqiData', latitude, longitude, selectedDate],
        queryFn: () => fetchAQIData(latitude, longitude, selectedDate),
        enabled: isReady,
        staleTime: 1000 * 60 * 5,
    });

    return {
        weatherDataResult: weatherQuery.data,
        aqiDataResult: aqiQuery.data,
        isLoading: weatherQuery.isLoading || aqiQuery.isLoading,
        isError: weatherQuery.isError || aqiQuery.isError,
        error: weatherQuery.error || aqiQuery.error,
    };
};

export const useHistoricalWeather = (latitude, longitude, startDate, endDate) => {
    const isReady = Boolean(latitude && longitude && startDate && endDate);

    const weatherArchiveQuery = useQuery({
        queryKey: ['weatherArchiveData', latitude, longitude, startDate, endDate],
        queryFn: () => fetchWeatherArchiveData(latitude, longitude, startDate, endDate),
        enabled: isReady,
        staleTime: 1000 * 60 * 60 * 24, // Archive static data wait 24h
    });

    const aqiArchiveQuery = useQuery({
        queryKey: ['aqiArchiveData', latitude, longitude, startDate, endDate],
        queryFn: () => fetchAQIArchiveData(latitude, longitude, startDate, endDate),
        enabled: isReady,
        staleTime: 1000 * 60 * 60 * 24, 
    });

    return {
        weatherArchiveResult: weatherArchiveQuery.data,
        aqiArchiveResult: aqiArchiveQuery.data,
        isLoading: weatherArchiveQuery.isLoading || aqiArchiveQuery.isLoading,
        isError: weatherArchiveQuery.isError || aqiArchiveQuery.isError,
        error: weatherArchiveQuery.error || aqiArchiveQuery.error,
    };
};

