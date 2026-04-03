import { useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  CloudRain,
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  Wind,
} from 'lucide-react'
import radarMap from '../assets/43a097e7-81dd-4472-b15b-1a6e8f497854.jpg'
import { getTheme } from '../utils/getTheme.js'
import HourlyCarousel from '../features/Dashboard/components/HourlyCarousel.jsx'
import { TemperatureChart, HumidityChart, PrecipitationChart, VisibilityChart, WindChart, ParticleChart } from '../features/Dashboard/components/ChartSection.jsx'
import { formatIsoDate, withDayOffset } from '../utils/formatters.js'
import { availableDates, weatherByDate, themeClasses,buildOverviewData } from '../features/Dashboard/Services/WeatherEngine.js'
import Navbar from '../components/Layout/Navbar.jsx'


const DashboardPage = () => {
  const todayIso = formatIsoDate(withDayOffset(0))
  const [selectedDate, setSelectedDate] = useState(todayIso)
  const [temperatureUnit, setTemperatureUnit] = useState('C')
  const [currentHour, setCurrentHour] = useState(new Date().getHours())


  const fallbackDate = availableDates.includes(selectedDate) ? selectedDate : todayIso
  const daily = weatherByDate[fallbackDate]

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHour(new Date().getHours())
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  
  const hourlyData = useMemo(
      () =>
        daily.hourly.map((item) => ({
          ...item,
          temperature: temperatureUnit === 'C' ? item.tempC : +((item.tempC * 9) / 5 + 32).toFixed(1),
        })),
      [daily, temperatureUnit],
    )
 

  const selectedDateLabel = new Date(`${fallbackDate}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const activeTheme = getTheme(currentHour)
  const temperatureUnitLabel = temperatureUnit === 'C' ? '° C' : '° F'

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${themeClasses[activeTheme]} bg-cover bg-center p-4 text-slate-100 transition-colors duration-1000`}>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-white/15 bg-black/5 p-5 shadow-2xl backdrop-blur-md sm:p-7">
        <Navbar/>
          

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-sm text-cyan-100">Temperature</p>
              <p className="mt-1 text-4xl font-semibold">{Math.round(daily.tempCurrent)}° C</p>
              <p className="mt-2 text-sm text-slate-200">Min {daily.tempMin}° C | Max {daily.tempMax}° C</p>
              <p className="text-sm text-slate-300">Feels like {daily.feelsLike}° C</p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="flex items-center gap-2 text-sm text-cyan-100">
                <CloudRain size={16} />
                Atmospheric Conditions
              </p>
              <p className="mt-2 text-sm text-slate-200">Precipitation: {daily.precipitationTotal} mm</p>
              <p className="text-sm text-slate-200">Relative Humidity: {daily.humidityNow}%</p>
              <p className="text-sm text-slate-200">UV Index: {daily.uvIndex}</p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-sm text-cyan-100">Sun Cycle</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-200">
                <Sunrise size={16} />
                Sunrise: {daily.sunrise}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-200">
                <Sunset size={16} />
                Sunset: {daily.sunset}
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-sm text-cyan-100">Wind & Air</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-200">
                <Wind size={16} />
                Max Wind Speed: {daily.maxWind} km/h
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-200">
                <Gauge size={16} />
                Precipitation Probability Max: {daily.precipitationProbabilityMax}%
              </p>
            </div>
          </div>

          <section className="mt-5 rounded-2xl border border-white/20 bg-white/10 p-4">
            <p className="mb-4 text-sm text-cyan-100">Air Quality Metrics</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-slate-900/35 p-3">
                <p className="text-xs text-slate-300">Air Quality Index</p>
                <p className="text-2xl font-semibold">{daily.aqi}</p>
              </div>
              <div className="rounded-xl bg-slate-900/35 p-3">
                <p className="text-xs text-slate-300">PM10</p>
                <p className="text-2xl font-semibold">{daily.pm10} ug/m3</p>
              </div>
              <div className="rounded-xl bg-slate-900/35 p-3">
                <p className="text-xs text-slate-300">PM2.5</p>
                <p className="text-2xl font-semibold">{daily.pm25} ug/m3</p>
              </div>
              <div className="rounded-xl bg-slate-900/35 p-3">
                <p className="text-xs text-slate-300">CO</p>
                <p className="text-2xl font-semibold">{daily.co} ppm</p>
              </div>
              <div className="rounded-xl bg-slate-900/35 p-3">
                <p className="text-xs text-slate-300">CO2</p>
                <p className="text-2xl font-semibold">{daily.co2} ppm</p>
              </div>
              <div className="rounded-xl bg-slate-900/35 p-3">
                <p className="text-xs text-slate-300">NO2</p>
                <p className="text-2xl font-semibold">{daily.no2} ppb</p>
              </div>
              <div className="rounded-xl bg-slate-900/35 p-3">
                <p className="text-xs text-slate-300">SO2</p>
                <p className="text-2xl font-semibold">{daily.so2} ppb</p>
              </div>
            </div>
          </section>

          <section className="mt-6 overflow-hidden rounded-2xl border border-white/20 bg-slate-900/40">
            <img src={radarMap} alt="Radar and map preview" className="h-44 w-full object-cover sm:h-52" />
            <p className="p-3 text-sm text-slate-200">Radar and map preview</p>
          </section>
        </section>

        <section className="mt-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">Hourly Data Visualizations</h2>
            <div className="inline-flex overflow-hidden rounded-full border border-white/20 bg-white/10">
              <button
                type="button"
                onClick={() => setTemperatureUnit('C')}
                className={`px-4 py-2 text-sm transition ${temperatureUnit === 'C' ? 'bg-cyan-300 text-slate-900' : 'text-slate-100 hover:bg-white/10'}`}
              >
                ° C
              </button>
              <button
                type="button"
                onClick={() => setTemperatureUnit('F')}
                className={`px-4 py-2 text-sm transition ${temperatureUnit === 'F' ? 'bg-cyan-300 text-slate-900' : 'text-slate-100 hover:bg-white/10'}`}
              >
                ° F
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <HourlyCarousel data={buildOverviewData(hourlyData)} temperatureUnitLabel={temperatureUnitLabel} />
            <TemperatureChart data={hourlyData} temperatureUnitLabel={temperatureUnitLabel} />
            <HumidityChart data={hourlyData} />
            <PrecipitationChart data={hourlyData} />
            <VisibilityChart data={hourlyData} />
            <WindChart data={hourlyData} />
            <ParticleChart data={hourlyData} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default DashboardPage