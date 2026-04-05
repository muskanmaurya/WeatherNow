export const fetchWeatherData = async (latitude, longitude, selectedDate) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${selectedDate}&end_date=${selectedDate}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code,is_day&hourly=temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,uv_index,visibility,wind_speed_10m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max&timezone=auto`,
  );
  if (!response.ok) throw new Error("Failed to fetch weather data");
  return response.json();
};

export const fetchAQIData = async (latitude, longitude, selectedDate) => {
  const response = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&start_date=${selectedDate}&end_date=${selectedDate}&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,carbon_dioxide&hourly=pm10,pm2_5&timezone=auto`,
  );
  if (!response.ok) throw new Error("Failed to fetch AQI data");
  return response.json();
};

export const fetchWeatherArchiveData = async (latitude, longitude, startDate, endDate) => {
  const response = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`,
  );
  if (!response.ok) throw new Error("Failed to fetch weather archive data");
  return response.json();
};

export const fetchAQIArchiveData = async (latitude, longitude, startDate, endDate) => {
  const response = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&hourly=pm10,pm2_5&timezone=auto`,
  );
  if (!response.ok) throw new Error("Failed to fetch AQI archive data");
  return response.json();
};
