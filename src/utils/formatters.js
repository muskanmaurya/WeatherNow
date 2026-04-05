export const formatIsoDate = (date) => {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const withDayOffset = (offset) => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + offset)
  return date
}

export const formatHourLabel = (hour) => {
  if (hour === 0) return '12 AM'
  if (hour < 12) return `${hour} AM`
  if (hour === 12) return '12 PM'
  return `${hour - 12} PM`
}

// export const formatTo12Hour = (isoString) => {
//   if (!isoString) return '--:--'

//   const timePart = isoString.split('T')[1]
//   if (!timePart) return '--:--'

//   let [hours, minutes] = timePart.split(':')
//   let h = parseInt(hours)
//   const m = minutes

//   const ampm = h >= 12 ? 'PM' : 'AM'
//   h = h % 12
//   h = h ? h : 12

//   return `${h}:${m} ${ampm}`
// };

export const formatTo12Hour = (isoString) => {
  if (typeof isoString !== 'string') return '--:--';

  const parts = isoString.split('T');
  if (parts.length < 2) return '--:--';

  const timePart = parts[1];
  const [hours, minutes] = timePart.split(':');

  if (!hours || !minutes) return '--:--';

  let h = parseInt(hours, 10);
  if (isNaN(h)) return '--:--';

  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;

  return `${h}:${minutes} ${ampm}`;
};

export const formatHourlyData = (hourly, aqiHourly) => {
  if (!hourly || !hourly.time) return [];

  return hourly.time.slice(0, 24).map((timeStr, index) => ({
    time: timeStr.split('T')[1], 
    temperature: hourly.temperature_2m?.[index] ?? 0,
    humidity: hourly.relative_humidity_2m?.[index] ?? 0,
    precipitation: hourly.precipitation?.[index] ?? 0,
    
    // MATCH THESE TO YOUR CHART JSX:
    visibility: (hourly.visibility?.[index] ?? 0) / 1000, // API gives meters, Chart wants km
    windSpeed10m: hourly.wind_speed_10m?.[index] ?? 0,
    
    // Particles (from the Air Quality API hourly data)
    pm10: aqiHourly?.pm10?.[index] ?? 0,
    pm25: aqiHourly?.pm2_5?.[index] ?? 0,
  }));
};