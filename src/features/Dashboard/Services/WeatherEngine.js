import { formatIsoDate, withDayOffset, formatHourLabel } from '../../../utils/formatters.js'
import { daySeeds } from '../../../features/Dashboard/Services/mockWeatherService.js'
 



export const buildHourlyData = (seed) =>
  Array.from({ length: 24 }, (_, hour) => {
    const wave = Math.sin(((hour - 6) / 24) * Math.PI * 2)
    const moistureWave = Math.cos((hour / 24) * Math.PI * 2)
    return {
      time: `${hour.toString().padStart(2, '0')}:00`,
      tempC: +(seed.tempBase + wave * seed.tempSwing).toFixed(1),
      humidity: Math.max(25, Math.min(95, Math.round(seed.humidityBase + moistureWave * 14))),
      precipitation: +(Math.max(0, seed.precipitationBase + (wave < 0 ? Math.abs(wave) : 0) * 1.2).toFixed(1)),
      visibility: +(Math.max(1, seed.visibilityBase - Math.abs(moistureWave) * 1.4).toFixed(1)),
      windSpeed10m: +(seed.windBase + Math.abs(wave) * 7.5).toFixed(1),
      precipitationProbability: Math.round(Math.max(5, Math.min(98, seed.popBase + (wave < 0 ? 30 : 8) * Math.abs(wave)))),
      pm10: +(seed.pm10Base + (hour > 18 ? 8 : 0) + Math.abs(moistureWave) * 7).toFixed(1),
      pm25: +(seed.pm25Base + (hour > 18 ? 4 : 0) + Math.abs(moistureWave) * 4.5).toFixed(1),
    }
  })

export const availableDates = [-2, -1, 0, 1, 2].map((offset) => formatIsoDate(withDayOffset(offset)))


export const weatherByDate = availableDates.reduce((acc, dateKey, index) => {
  const seed = daySeeds[index]
  const hourly = buildHourlyData(seed)
  const tempValues = hourly.map((item) => item.tempC)
  const maxWind = Math.max(...hourly.map((item) => item.windSpeed10m))
  const precipitationProbabilityMax = Math.max(...hourly.map((item) => item.precipitationProbability))
  const currentHour = new Date().getHours()

  acc[dateKey] = {
    ...seed,
    dateKey,
    hourly,
    tempMin: +Math.min(...tempValues).toFixed(1),
    tempMax: +Math.max(...tempValues).toFixed(1),
    tempCurrent: hourly[currentHour]?.tempC ?? hourly[12].tempC,
    maxWind,
    precipitationProbabilityMax,
    precipitationTotal: +hourly.reduce((total, item) => total + item.precipitation, 0).toFixed(1),
    humidityNow: hourly[currentHour]?.humidity ?? hourly[12].humidity,
    pm10: +(hourly.reduce((total, item) => total + item.pm10, 0) / 24).toFixed(1),
    pm25: +(hourly.reduce((total, item) => total + item.pm25, 0) / 24).toFixed(1),
  }

  return acc
}, {})

const overviewSlots = [12, 14, 16, 18, 20, 22, 0, 2, 4, 6, 8, 10]


export const buildOverviewData = (hourlyData) =>
  overviewSlots.map((hour, index) => {
    const source = hourlyData[hour]
    return {
      id: index,
      hour,
      slotLabel: formatHourLabel(hour),
      icon: getHourEmoji(hour),
      temperature: source.temperature,
      precipitationProbability: source.precipitationProbability,
      showDayBadge: hour === 0,
    }
  })

  export const getHourEmoji = (hour) => {
  if (hour >= 12 && hour < 16) return '☀️'
  if (hour >= 16 && hour < 19) return '🌤️'
  if (hour >= 19 || hour < 5) return '🌙'
  return '🌥️'
}

export const themeClasses = {
    morning: "from-blue-300 to-blue-400",
    afternoon: "from-blue-400 to-blue-600",
    evening: "from-indigo-500 via-purple-500 to-orange-400",
    night: "from-slate-900 via-blue-900 to-black"
};

