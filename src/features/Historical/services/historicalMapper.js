import { formatLongDateLabel, formatShortDateLabel, formatMinutesToIst, WIND_DIRECTIONS } from './historicalEngine.js'

const directionFromDegrees = (degrees) => {
	if (degrees === null || degrees === undefined) return '--'
	const index = Math.round((((degrees % 360) + 360) % 360) / 22.5) % WIND_DIRECTIONS.length
	return WIND_DIRECTIONS[index]
}

const getMinutesFromIso = (isoString) => {
	if (!isoString) return 0
	// Try parsing it as a Date
	const date = new Date(isoString)
	if (isNaN(date.getTime())) return 0
	return date.getHours() * 60 + date.getMinutes()
}

export const mapHistoricalData = (weatherData, airQualityData) => {
	const daily = weatherData?.daily || {}
	const aqHourly = airQualityData?.hourly || {}
	const times = daily.time || []

	// Aggregate Air Quality data by day (API returns hourly for PM10/PM2.5)
	const aqDaily = {}
	if (aqHourly.time) {
		aqHourly.time.forEach((timeStr, index) => {
			const dateKey = timeStr.split('T')[0] // Extract YYYY-MM-DD
			if (!aqDaily[dateKey]) {
				aqDaily[dateKey] = { pm10Sum: 0, pm25Sum: 0, count: 0 }
			}
			const pm10 = aqHourly.pm10?.[index]
			const pm25 = aqHourly.pm2_5?.[index]
			if (pm10 != null) {
				aqDaily[dateKey].pm10Sum += pm10
				aqDaily[dateKey].count += 1 // count once per valid data point pair
			} else if (pm25 != null) {
				aqDaily[dateKey].count += 1
			}
			if (pm25 != null) aqDaily[dateKey].pm25Sum += pm25
		})
	}

	return times.map((dateKey, index) => {
		const tempMean = +(daily.temperature_2m_mean?.[index] ?? 0).toFixed(1)
		const tempMax = +(daily.temperature_2m_max?.[index] ?? 0).toFixed(1)
		const tempMin = +(daily.temperature_2m_min?.[index] ?? 0).toFixed(1)
		const precipitationTotal = +(daily.precipitation_sum?.[index] ?? 0).toFixed(1)

		const sunriseMinutes = getMinutesFromIso(daily.sunrise?.[index])
		const sunsetMinutes = getMinutesFromIso(daily.sunset?.[index])

		const maxWindSpeed = +(daily.wind_speed_10m_max?.[index] ?? 0).toFixed(1)
		const dominantWindDegrees = daily.wind_direction_10m_dominant?.[index] ?? 0
		const dominantWindDirection = directionFromDegrees(dominantWindDegrees)

		const aqDay = aqDaily[dateKey] || { pm10Sum: 0, pm25Sum: 0, count: 1 }
		const count = aqDay.count || 1
		const pm10 = +(aqDay.pm10Sum / count).toFixed(1)
		const pm25 = +(aqDay.pm25Sum / count).toFixed(1)

		return {
			dateKey,
			dateLabel: formatLongDateLabel(dateKey),
			shortDateLabel: formatShortDateLabel(dateKey),
			tempMean,
			tempMax,
			tempMin,
			sunriseMinutes,
			sunsetMinutes,
			sunriseLabel: formatMinutesToIst(sunriseMinutes),
			sunsetLabel: formatMinutesToIst(sunsetMinutes),
			precipitationTotal,
			maxWindSpeed,
			dominantWindDegrees,
			dominantWindDirection,
			pm10,
			pm25,
		}
	})
}
