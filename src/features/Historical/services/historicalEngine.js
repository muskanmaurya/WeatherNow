import { formatIsoDate, withDayOffset } from '../../../utils/formatters.js'

const HISTORY_DAYS = 730
const TAU = Math.PI * 2

export const WIND_DIRECTIONS = [
	'N',
	'NNE',
	'NE',
	'ENE',
	'E',
	'ESE',
	'SE',
	'SSE',
	'S',
	'SSW',
	'SW',
	'WSW',
	'W',
	'WNW',
	'NW',
	'NNW',
]

const DAY_MS = 24 * 60 * 60 * 1000

const buildDateFromOffset = (offset) => {
	const date = withDayOffset(0)
	date.setDate(date.getDate() + offset)
	return date
}

const parseDateKey = (dateKey) => new Date(`${dateKey}T00:00:00`)

const clampMinutes = (minutes) => {
	const value = Math.round(minutes)
	return ((value % 1440) + 1440) % 1440
}

export const formatMinutesToIst = (minutes) => {
	const totalMinutes = clampMinutes(minutes)
	const hours = Math.floor(totalMinutes / 60)
	const mins = totalMinutes % 60
	return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} IST`
}

export const formatShortDateLabel = (dateKey) =>
	new Date(`${dateKey}T00:00:00`).toLocaleDateString(undefined, {
		month: 'short',
		day: 'numeric',
	})

export const formatLongDateLabel = (dateKey) =>
	new Date(`${dateKey}T00:00:00`).toLocaleDateString(undefined, {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})

export const shiftDateKey = (dateKey, offsetDays) => {
	const date = parseDateKey(dateKey)
	date.setDate(date.getDate() + offsetDays)
	return formatIsoDate(date)
}

const directionFromDegrees = (degrees) => {
	const index = Math.round((((degrees % 360) + 360) % 360) / 22.5) % WIND_DIRECTIONS.length
	return WIND_DIRECTIONS[index]
}

const average = (values) => {
	if (!values.length) return 0
	return values.reduce((total, value) => total + value, 0) / values.length
}

const buildHistoricalRecord = (offset) => {
	const date = buildDateFromOffset(offset)
	const dateKey = formatIsoDate(date)
	const seasonalWave = Math.sin((offset / 365) * TAU)
	const monthlyWave = Math.sin((offset / 28) * TAU)
	const weeklyWave = Math.sin((offset / 7) * TAU)
	const monsoonWave = Math.max(0, Math.sin(((offset - 110) / 70) * TAU))

	const tempMean = +(25 + seasonalWave * 6.5 + monthlyWave * 1.4 + weeklyWave * 0.4).toFixed(1)
	const tempMax = +(tempMean + 4.3 + Math.abs(Math.sin(offset / 13)) * 1.8).toFixed(1)
	const tempMin = +(tempMean - 4.7 - Math.abs(Math.cos(offset / 15)) * 1.4).toFixed(1)
	const precipitationTotal = +Math.max(0, monsoonWave * 18 + Math.abs(Math.cos(offset / 9)) * 2.4).toFixed(1)
	const sunriseMinutes = clampMinutes(400 - seasonalWave * 18 - Math.cos(offset / 21) * 4)
	const sunsetMinutes = clampMinutes(1085 + seasonalWave * 19 + Math.sin(offset / 18) * 5)
	const maxWindSpeed = +(11 + Math.abs(Math.sin(offset / 10)) * 8 + Math.max(0, seasonalWave) * 2).toFixed(1)
	const windDegrees = ((offset * 17 + 210 + seasonalWave * 30) % 360 + 360) % 360
	const pm10 = +(41 + seasonalWave * 9 + Math.abs(Math.cos(offset / 12)) * 7 + monsoonWave * 4).toFixed(1)
	const pm25 = +(24 + seasonalWave * 6 + Math.abs(Math.sin(offset / 14)) * 4 + monsoonWave * 2.5).toFixed(1)

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
		dominantWindDegrees: windDegrees,
		dominantWindDirection: directionFromDegrees(windDegrees),
		pm10,
		pm25,
	}
}

export const historicalSeries = Array.from({ length: HISTORY_DAYS }, (_, index) =>
	buildHistoricalRecord(index - HISTORY_DAYS + 1),
)

export const historicalBounds = {
	minDate: historicalSeries[0]?.dateKey,
	maxDate: historicalSeries[historicalSeries.length - 1]?.dateKey,
}

export const daysBetween = (startDate, endDate) => {
	const start = parseDateKey(startDate)
	const end = parseDateKey(endDate)
	return Math.round((end - start) / DAY_MS)
}

export const getHistoricalRange = (startDate, endDate) =>
	historicalSeries.filter((record) => record.dateKey >= startDate && record.dateKey <= endDate)

export const getDirectionDistribution = (records) => {
	const counts = WIND_DIRECTIONS.reduce((accumulator, direction) => {
		accumulator[direction] = 0
		return accumulator
	}, {})

	records.forEach((record) => {
		counts[record.dominantWindDirection] += 1
	})

	return WIND_DIRECTIONS.map((direction) => ({
		direction,
		count: counts[direction],
	}))
}

export const summariseHistoricalRange = (records) => {
	if (!records.length) return null

	const totalPrecipitation = records.reduce((total, record) => total + record.precipitationTotal, 0)
	const maxTemp = Math.max(...records.map((record) => record.tempMax))
	const minTemp = Math.min(...records.map((record) => record.tempMin))
	const maxWindSpeed = Math.max(...records.map((record) => record.maxWindSpeed))
	const directionDistribution = getDirectionDistribution(records)
	const dominantDirection = directionDistribution.reduce((best, current) =>
		current.count > best.count ? current : best,
	)

	return {
		rangeLength: records.length,
		startDate: records[0].dateLabel,
		endDate: records[records.length - 1].dateLabel,
		meanTemp: +average(records.map((record) => record.tempMean)).toFixed(1),
		maxTemp: +maxTemp.toFixed(1),
		minTemp: +minTemp.toFixed(1),
		avgSunriseMinutes: Math.round(average(records.map((record) => record.sunriseMinutes))),
		avgSunsetMinutes: Math.round(average(records.map((record) => record.sunsetMinutes))),
		totalPrecipitation: +totalPrecipitation.toFixed(1),
		maxWindSpeed: +maxWindSpeed.toFixed(1),
		dominantWindDirection: dominantDirection.direction,
		dominantWindDirectionCount: dominantDirection.count,
		meanPm10: +average(records.map((record) => record.pm10)).toFixed(1),
		meanPm25: +average(records.map((record) => record.pm25)).toFixed(1),
	}
}

export const buildComparisonRows = (records) => {
	if (!records.length) return []

	const first = records[0]
	const last = records[records.length - 1]

	return [
		{
			label: 'Mean temperature',
			start: `${first.tempMean}° C`,
			end: `${last.tempMean}° C`,
			change: `${(last.tempMean - first.tempMean).toFixed(1)}° C`,
		},
		{
			label: 'Max wind speed',
			start: `${first.maxWindSpeed} km/h`,
			end: `${last.maxWindSpeed} km/h`,
			change: `${(last.maxWindSpeed - first.maxWindSpeed).toFixed(1)} km/h`,
		},
		{
			label: 'PM10',
			start: `${first.pm10} ug/m3`,
			end: `${last.pm10} ug/m3`,
			change: `${(last.pm10 - first.pm10).toFixed(1)} ug/m3`,
		},
		{
			label: 'PM2.5',
			start: `${first.pm25} ug/m3`,
			end: `${last.pm25} ug/m3`,
			change: `${(last.pm25 - first.pm25).toFixed(1)} ug/m3`,
		},
	]
}
