import { formatHourLabel } from '../../../utils/formatters.js'

const overviewSlots = [12, 14, 16, 18, 20, 22, 0, 2, 4, 6, 8, 10]


export const buildOverviewData = (hourlyData) =>
  overviewSlots.map((hour, index) => {
    const source = hourlyData[hour]
    return {
      id: index,
      hour,
      slotLabel: formatHourLabel(hour),
      icon: getHourEmoji(source?.weatherCode, source?.isDay),
      temperature: source?.temperature ?? 0,
      precipitationProbability: source?.precipitationProbability ?? 0,
      showDayBadge: hour === 0,
    }
  })

  export const getHourEmoji = (weatherCode, isDay) => {
  // Map WMO weather codes to emojis
  if (weatherCode === 0) return isDay ? '☀️' : '🌙'; // Clear
  if (weatherCode === 1 || weatherCode === 2) return isDay ? '🌤️' : '☁️'; // Partly cloudy
  if (weatherCode === 3) return '☁️'; // Overcast
  if (weatherCode >= 45 && weatherCode <= 48) return '🌫️'; // Fog
  if (weatherCode >= 51 && weatherCode <= 67) return '🌧️'; // Drizzle / Rain
  if (weatherCode >= 71 && weatherCode <= 77) return '❄️'; // Snow
  if (weatherCode >= 80 && weatherCode <= 82) return '🌦️'; // Rain showers
  if (weatherCode >= 85 && weatherCode <= 86) return '🌨️'; // Snow showers
  if (weatherCode >= 95 && weatherCode <= 99) return '⛈️'; // Thunderstorm
  
  // Fallback
  return isDay ? '🌥️' : '🌙☁️';
}

export const themeClasses = {
    morning: "from-blue-300 to-blue-400",
    afternoon: "from-blue-400 to-blue-600",
    evening: "from-indigo-500 via-purple-500 to-orange-400",
    night: "from-slate-900 via-blue-900 to-black"
};

