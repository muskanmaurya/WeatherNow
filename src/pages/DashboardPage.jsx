import { useEffect, useMemo, useState } from 'react'
import {CloudRain,Gauge,Sunrise,Sunset,Wind} from 'lucide-react'
import { getTheme } from '../utils/getTheme.js'
import HourlyCarousel from '../features/Dashboard/components/HourlyCarousel.jsx'
import { HumidityChart, PrecipitationChart, VisibilityChart, WindChart, ParticleChart } from '../features/Dashboard/components/ChartSection.jsx'
import { formatHourlyData, formatTo12Hour } from '../utils/formatters.js'
import { themeClasses,buildOverviewData } from '../features/Dashboard/Services/WeatherEngine.js'
import Navbar from '../components/Layout/Navbar.jsx'
import Footer from '../components/Layout/Footer.jsx'
import { useGeolocation } from '../hooks/useGeolocation.js'
import { mapWeatherData } from '../features/Dashboard/Services/weatherMapper.js'
import { useDashboardWeather } from '../hooks/useWeather.js'
import Loader from '../components/Common/Loader.jsx'

const DashboardPage = () => {

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [temperatureUnit, setTemperatureUnit] = useState('C')
  const [currentHour, setCurrentHour] = useState(new Date().getHours())

  const { location } = useGeolocation(); // This now gives you { lat, lon, city }

  // Use the custom hook to fetch weather and AQI data based on location and selected date
  const { weatherDataResult, aqiDataResult, isLoading, isError } = useDashboardWeather(location.lat, location.lon, selectedDate);

  // Map the raw API results into the format our component expects
  const weatherData = useMemo(() => {
    if (weatherDataResult && aqiDataResult) {
      return mapWeatherData(weatherDataResult, aqiDataResult);
    }
    return null;
  }, [weatherDataResult, aqiDataResult]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHour(new Date().getHours())
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])


  const activeTheme = getTheme(currentHour)
  const temperatureUnitLabel = temperatureUnit === 'C' ? '° C' : '° F'

  // Inside your component's main body:
const rawChartData = formatHourlyData(weatherData?.hourly, weatherData?.airQualityHourly);

const chartData = useMemo(() => {
  if (!rawChartData) return [];
  return rawChartData.map((item) => ({
    ...item,
    temperature:
      temperatureUnit === 'C'
        ? item.temperature // Assuming formatHourlyData provides it in Celsius
        : +((item.temperature * 9) / 5 + 32).toFixed(1),
  }));
}, [rawChartData, temperatureUnit]);

// Determine which hour to show for historical/future dates.
// We use the current local hour (so if it's 15:00 now, we show the 15:00 entry
// from the hourly arrays when the user selects yesterday/tomorrow).
const targetHour = currentHour ?? new Date().getHours();

// Compute display values (use `current` for today, hourly arrays for other dates)
const isTodayView = selectedDate === new Date().toISOString().split('T')[0];

const displayTemp = isTodayView
  ? weatherData?.current?.temp
  : weatherData?.hourly?.temperature_2m?.[targetHour] ?? '--';

const displayWind = isTodayView
  ? weatherData?.current?.wind
  : weatherData?.hourly?.wind_speed_10m?.[targetHour] ?? '--';

const displayHumidity = isTodayView
  ? weatherData?.current?.humidity
  : weatherData?.hourly?.relative_humidity_2m?.[targetHour] ?? '--';

const displayAQI = isTodayView
  ? weatherData?.airQuality?.aqi
  : weatherData?.airQualityHourly?.european_aqi?.[targetHour] ?? weatherData?.airQualityHourly?.pm10?.[targetHour] ?? '--';

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-950 via-indigo-950 to-slate-950 px-4 text-white">
        <div className="w-full max-w-sm rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center shadow-2xl backdrop-blur-md">
          <h2 className="text-lg font-semibold text-red-200">System Malfunction</h2>
          <p className="mt-2 text-sm text-red-100/70">Failed to fetch weather data for {location.city || 'your location'}.</p>
        </div>
      </div>
    )
  }

  if (isLoading || !weatherData) {
  return (
    <Loader/>
  );
}

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${themeClasses[activeTheme]} bg-cover bg-center p-2 text-slate-100 transition-colors duration-1000 sm:p-4`}>
      <main className="mx-auto w-full max-w-7xl px-2 py-4 sm:px-4 sm:py-6 lg:px-8">
        <section className="rounded-3xl border border-white/15 bg-black/5 p-4 shadow-2xl backdrop-blur-md sm:p-5 lg:p-7">
        <Navbar selectedDate={selectedDate} 
        onDateChange={(newDate)=>setSelectedDate(newDate)} /> 

          <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-cyan-100 sm:text-sm">Temperature</p>
              <p className="mt-1 text-5xl font-semibold sm:text-4xl">{displayTemp ?? '--'}°C</p>
              <p className="mt-2 text-xs text-slate-200 sm:text-sm">Min {weatherData?.daily?.minTemp ?? '--'}° C | Max {weatherData?.daily?.maxTemp ?? '--'}° C</p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="flex items-center gap-2 text-sm text-cyan-100">
                <CloudRain size={16} />
                Atmospheric Conditions
              </p>
              <p className="mt-2 text-xs text-slate-200 sm:text-sm">Precipitation: {weatherData?.hourly?.precipitation?.[targetHour] ?? '--'} mm</p>
              <p className="text-xs text-slate-200 sm:text-sm">Relative Humidity: {displayHumidity ?? '--'}%</p>
              <p className="text-xs text-slate-200 sm:text-sm">UV Index: {weatherData?.uvIndex ?? '--'}</p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-sm text-cyan-100">Sun Cycle</p>
              <p className="mt-2 flex items-center gap-2 text-xs text-slate-200 sm:text-sm">
                <Sunrise size={16} />
                Sunrise: {formatTo12Hour(weatherData?.daily?.sunrise)}
              </p>
              <p className="mt-1 flex items-center gap-2 text-xs text-slate-200 sm:text-sm">
                <Sunset size={16} />
                Sunset: {formatTo12Hour(weatherData?.daily?.sunset)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-sm text-cyan-100">Wind & Air</p>              <p className="mt-2 flex items-center gap-2 text-xs text-slate-200 sm:text-sm">
                <Wind size={16} />
                Max Wind Speed: {weatherData?.daily?.maxWind ?? '--'} km/h
              </p>
              <p className="mt-1 flex items-center gap-2 text-xs text-slate-200 sm:text-sm">
                <Gauge size={16} />
                Precipitation Probability Max: {weatherData.daily?.rainProb ?? '--'}%
              </p>
            </div>
          </div>

          <section className="mt-5 rounded-2xl border border-white/20 bg-white/10 p-4">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-cyan-100 sm:text-sm">Air Quality Metrics</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-slate-900/35 p-3">
                <p className="text-xs text-slate-300">Air Quality Index</p>
                <p className="text-2xl font-semibold">{displayAQI ?? (weatherData?.airQuality?.aqi ?? '--')}</p>
              </div>
              <div className="rounded-xl bg-slate-900/35 p-3">
                <p className="text-xs text-slate-300">PM10</p>
                <p className="text-2xl font-semibold">{weatherData?.airQuality?.pm10 ?? '--'} ug/m3</p>
              </div>
              <div className="rounded-xl bg-slate-900/35 p-3">
                <p className="text-xs text-slate-300">PM2.5</p>
                <p className="text-2xl font-semibold">{weatherData?.airQuality?.pm25 ?? '--'} ug/m3</p>
              </div>
              <div className="rounded-xl bg-slate-900/35 p-3">
                <p className="text-xs text-slate-300">CO</p>
                <p className="text-2xl font-semibold">{weatherData?.airQuality?.co ?? '--'} ppm</p>
              </div>
              <div className="rounded-xl bg-slate-900/35 p-3">
                <p className="text-xs text-slate-300">CO2</p>
                <p className="text-2xl font-semibold">{weatherData?.airQuality?.co2 ?? '--'} ppm</p>
              </div>
              <div className="rounded-xl bg-slate-900/35 p-3">
                <p className="text-xs text-slate-300">NO2</p>
                <p className="text-2xl font-semibold">{weatherData?.airQuality?.no2 ?? '--'} ppb</p>
              </div>
              <div className="rounded-xl bg-slate-900/35 p-3">
                <p className="text-xs text-slate-300">SO2</p>
                <p className="text-2xl font-semibold">{weatherData?.airQuality?.so2 ?? '--'} ppb</p>
              </div>
            </div>
          </section>
        </section>

        <section className="mt-7">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold sm:text-2xl">Hourly Data Visualizations</h2>
            <div className="self-start sm:self-auto inline-flex overflow-hidden rounded-full border border-white/20 bg-white/10">
              <button
                type="button"
                onClick={() => setTemperatureUnit('C')}
                className={`px-3 py-2 text-sm transition sm:px-4 ${temperatureUnit === 'C' ? 'bg-cyan-300 text-slate-900' : 'text-slate-100 hover:bg-white/10'}`}
              >
                ° C
              </button>
              <button
                type="button"
                onClick={() => setTemperatureUnit('F')}
                className={`px-3 py-2 text-sm transition sm:px-4 ${temperatureUnit === 'F' ? 'bg-cyan-300 text-slate-900' : 'text-slate-100 hover:bg-white/10'}`}
              >
                ° F
              </button>
            </div>
          </div>

          <div className="mb-4">
            <HourlyCarousel data={buildOverviewData(chartData)} temperatureUnitLabel={temperatureUnitLabel} weatherData={weatherData} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <HumidityChart data={chartData} />
            <PrecipitationChart data={chartData} />
            <VisibilityChart data={chartData} />
            <WindChart data={chartData} />
            <ParticleChart data={chartData} />
          </div>
        </section>
        <Footer />
      </main>
    </div>
  )
}

export default DashboardPage