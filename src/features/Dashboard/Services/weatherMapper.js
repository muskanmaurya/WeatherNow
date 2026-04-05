export const mapWeatherData = (weather, aqi) => {
  const currentWeather = weather?.current ?? weather?.current_weather ?? {};
  const dailyWeather = weather?.daily ?? {};
  const currentAqi = aqi?.current ?? {};
  const hourlyAqi = aqi?.hourly ?? {};

  return {
    current: {
      temp: currentWeather.temperature_2m ?? currentWeather.temperature ?? null,
      humidity: currentWeather.relative_humidity_2m ?? null,
      wind: currentWeather.wind_speed_10m ?? currentWeather.windspeed ?? null,
    },
    daily: {
      maxTemp: dailyWeather.temperature_2m_max?.[0] ?? null,
      minTemp: dailyWeather.temperature_2m_min?.[0] ?? null,
      sunrise: dailyWeather.sunrise?.[0] ?? null,
      sunset: dailyWeather.sunset?.[0] ?? null,
      maxWind: dailyWeather.wind_speed_10m_max?.[0] ?? null,
      rainProb: dailyWeather.precipitation_probability_max?.[0] ?? null,
    },
    airQuality: {
      aqi: currentAqi.european_aqi ?? null,
      pm10: currentAqi.pm10 ?? null,
      pm25: currentAqi.pm2_5 ?? null,
      co: currentAqi.carbon_monoxide ?? null,
      co2: currentAqi.carbon_dioxide ?? null,
      no2: currentAqi.nitrogen_dioxide ?? null,
      so2: currentAqi.sulphur_dioxide ?? null,
    },
    uvIndex: weather?.hourly?.uv_index?.[0] ?? null,
    hourly: weather?.hourly ?? {},
    airQualityHourly: hourlyAqi,
  };
};