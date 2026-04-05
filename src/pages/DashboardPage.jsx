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
import { getTheme } from '../utils/getTheme.js'
import HourlyCarousel from '../features/Dashboard/components/HourlyCarousel.jsx'
import { TemperatureChart, HumidityChart, PrecipitationChart, VisibilityChart, WindChart, ParticleChart } from '../features/Dashboard/components/ChartSection.jsx'
import { formatIsoDate, withDayOffset,formatHourlyData, formatTo12Hour } from '../utils/formatters.js'
import { availableDates, weatherByDate, themeClasses,buildOverviewData } from '../features/Dashboard/Services/WeatherEngine.js'
import Navbar from '../components/Layout/Navbar.jsx'
import { useGeolocation } from '../hooks/useGeolocation.js'
import { mapWeatherData } from '../features/Dashboard/Services/weatherMapper.js'


const DashboardPage = () => {
  const todayIso = formatIsoDate(withDayOffset(0))
// At the top of DashboardPage
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [temperatureUnit, setTemperatureUnit] = useState('C')
  const [currentHour, setCurrentHour] = useState(new Date().getHours())

  const fallbackDate = availableDates.includes(selectedDate) ? selectedDate : todayIso
  const daily = weatherByDate[fallbackDate]

 

  const [weatherData, setWeatherData] = useState(null);
  const { location } = useGeolocation(); // This now gives you { lat, lon, city }

  // At the very top of your fetch function, determine if we are looking at "Today"
const isToday = selectedDate === new Date().toISOString().split('T')[0];


  
  useEffect(()=>{
    if (!location.lat || !location.lon) return;

    const fetchAllData=async()=>{
      try {
        const [weatherRes, aqiRes] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&start_date=${selectedDate}&end_date=${selectedDate}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,uv_index,visibility,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max&timezone=auto`),
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.lat}&longitude=${location.lon}&start_date=${selectedDate}&end_date=${selectedDate}&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,carbon_dioxide&hourly=pm10,pm2_5&timezone=auto`)
          // fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&start_date=${selectedDate}&end_date=${selectedDate}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,uv_index,visibility,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max&timezone=auto`),
          // fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.lat}&longitude=${location.lon}&start_date=${selectedDate}&end_date=${selectedDate}&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,carbon_dioxide&hourly=pm10,pm2_5&timezone=auto`)
          // fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&start_date=${selectedDate}&end_date=${selectedDate}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,uv_index,visibility,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max&timezone=auto`),
          // fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.lat}&longitude=${location.lon}&start_date=${selectedDate}&end_date=${selectedDate}&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,carbon_dioxide&hourly=pm10,pm2_5&timezone=auto`)
    ]);

    const weather = await weatherRes.json();
    const aqi = await aqiRes.json();

    const formattedData=mapWeatherData(weather, aqi)
    setWeatherData(formattedData);

    // const hourIdx = new Date().getHours();
    // const isToday = selectedDate === new Date().toISOString().split('T')[0];

    // const currentHour = new Date().getHours();
    // const isToday = selectedDate === new Date().toISOString().split('T')[0];

    // setWeatherData({
  // MAIN BOXES: If it's today, use 'current'. If not, use 'daily' or 'hourly'
  // displayTemp: isToday 
  //   ? weather.current.temperature_2m 
  //   : weather.daily.temperature_2m_max[0],
    
  // displayWind: isToday 
  //   ? weather.current.wind_speed_10m 
  //   : weather.daily.wind_speed_10m_max[0],
    
  // displayHumidity: isToday 
  //   ? weather.current.relative_humidity_2m 
  //   : weather.hourly.relative_humidity_2m[0],

  // displayAQI: isToday 
  //   ? aqi.current.european_aqi 
  //   : aqi.hourly.european_aqi?.[12] || aqi.hourly.pm10[12], // Pick noon value for historical AQI

  // // REST OF DATA (These already change correctly with the date!)
  // maxTemp: weather.daily.temperature_2m_max[0],
  // minTemp: weather.daily.temperature_2m_min[0],
  // sunrise: weather.daily.sunrise[0],
  // sunset: weather.daily.sunset[0],
  // hourly: weather.hourly,
  // aqiHourly: aqi.hourly,
  // Add all other gas metrics from aqi.current or aqi.hourly here...

      // displayTemp: isToday ? weather.current.temperature_2m : weather.hourly.temperature_2m[hourIdx],
      // displayWind: isToday ? weather.current.wind_speed_10m : weather.hourly.wind_speed_10m[hourIdx],
      // displayHumidity: isToday ? weather.current.relative_humidity_2m : weather.hourly.relative_humidity_2m[hourIdx],
      // displayAQI: isToday ? aqi.current.european_aqi : aqi.hourly.european_aqi[hourIdx],

      // // GAS METRICS (Synced to the same hour)
      // pm10: isToday ? aqi.current.pm10 : aqi.hourly.pm10[hourIdx],
      // pm25: isToday ? aqi.current.pm2_5 : aqi.hourly.pm2_5[hourIdx],
      
      // // REST OF DATA (Daily stats already respect the start_date/end_date)
      // maxTemp: weather.daily.temperature_2m_max[0],
      // minTemp: weather.daily.temperature_2m_min[0],
      // sunrise: weather.daily.sunrise[0],
      // sunset: weather.daily.sunset[0],
      // maxWind: weather.daily.wind_speed_10m_max[0],
      // rainProb: weather.daily.precipitation_probability_max[0],
      
      // // UV & Visibility (Taking the hour-specific value)
      // uvIndex: weather.hourly.uv_index[hourIdx],
      // visibility: weather.hourly.visibility[hourIdx] / 1000, // Convert m to km

      // // ARRAYS FOR CHARTS (Pass the whole 24h array)
      // hourly: weather.hourly,
      // airQualityHourly: aqi.hourly,

// });


    console.log(formattedData);
      } catch (error) {
        console.log("failed to fetch data",error);
        
      }
    }

    fetchAllData();

  },[location.lat, location.lon, selectedDate])

  // This will show the max temp for the date you selected

  

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHour(new Date().getHours())
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    // Now, instead of hardcoding 28.61, use:
    // fetchWeather(location.lat, location.lon);
    console.log("Detecting location...", location.lat, location.lon);
  }, [location]); // Re-run when location is detected


  useEffect(()=>{
    if(!location.lat || !location.lon) return;

    const fetchTimedData=async()=>{
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&start_date=${selectedDate}&end_date=${selectedDate}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,uv_index,visibility,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max&timezone=auto`
      const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.lat}&longitude=${location.lon}&start_date=${selectedDate}&end_date=${selectedDate}&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,carbon_dioxide&hourly=pm10,pm2_5&timezone=auto`
    
    }
  })
  
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

  // console.log(weatherData?.current?.temp ?? '--')
  // console.log(weatherData?.daily?.rainProb ?? '--')
  // console.log(weatherData?.airQuality?.aqi ?? '--')
  // console.log(weatherData?.daily?.maxWind ?? '--')
  // console.log(formatTo12Hour(weatherData.daily.sunrise))
  // console.log(weatherData?.uvIndex?? '--')

  // Inside your component's main body:
const chartData = formatHourlyData(weatherData?.hourly, weatherData?.airQualityHourly);

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

  if (!weatherData) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-950 via-indigo-950 to-slate-950 px-4 text-white">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-md sm:p-8">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent sm:h-14 sm:w-14"></div>
        <h2 className="text-lg font-semibold sm:text-xl">Syncing with satellites...</h2>
        <p className="mt-2 text-sm text-slate-300 sm:text-base">Fetching live data for {location.city}</p>
      </div>
    </div>
  );
}

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${themeClasses[activeTheme]} bg-cover bg-center p-2 text-slate-100 transition-colors duration-1000 sm:p-4`}>
      <main className="mx-auto w-full max-w-7xl px-2 py-4 sm:px-4 sm:py-6 lg:px-8">
        <section className="rounded-3xl border border-white/15 bg-black/5 p-4 shadow-2xl backdrop-blur-md sm:p-5 lg:p-7">
        <Navbar selectedDate={selectedDate} 
        onDateChange={(newDate)=>setSelectedDate(newDate)} /> 

        

{/* Main Temp Display
<h1 className="text-8xl font-bold">{weatherData.displayTemp}°</h1>

{/* Details Cards */}
{/* <p className="mt-1 text-3xl font-semibold">{weatherData.displayTemp}° C</p>
<p>Wind Speed: {weatherData.displayWind} km/h</p>
<p>Humidity: {weatherData.displayHumidity}%</p>
<p>AQI: {weatherData.displayAQI}</p> */} 

          <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-cyan-100 sm:text-sm">Temperature</p>
              <p className="mt-1 text-3xl font-semibold sm:text-4xl">{displayTemp ?? '--'}° C</p>
              <p className="mt-2 text-xs text-slate-200 sm:text-sm">Min {weatherData?.daily?.minTemp ?? '--'}° C | Max {weatherData?.daily?.maxTemp ?? '--'}° C</p>
              <p className="text-xs text-slate-300 sm:text-sm">Feels like {weatherData?.daily?.feelsLike ?? '--'}° C</p>
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
              <p className="text-sm text-cyan-100">Wind & Air</p>
              <p className="text-xs text-cyan-100 sm:text-sm">Wind Speed {displayWind ?? '--'}</p>
              <p className="mt-2 flex items-center gap-2 text-xs text-slate-200 sm:text-sm">
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

          {/* <section className="mt-6 overflow-hidden rounded-2xl border border-white/20 bg-slate-900/40">
            <img src={radarMap} alt="Radar and map preview" className="h-44 w-full object-cover sm:h-52" />
            <p className="p-3 text-sm text-slate-200">Radar and map preview</p>
          </section> */}
        </section>

        <section className="mt-7">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold sm:text-2xl">Hourly Data Visualizations</h2>
            <div className="inline-flex overflow-hidden rounded-full border border-white/20 bg-white/10">
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

          <div className="grid gap-4 lg:grid-cols-2">
            <HourlyCarousel data={buildOverviewData(chartData)} temperatureUnitLabel={temperatureUnitLabel} />
            {/* <TemperatureChart data={hourlyData} temperatureUnitLabel={temperatureUnitLabel} />
            <HumidityChart data={hourlyData} />
            <PrecipitationChart data={hourlyData} />
            <VisibilityChart data={hourlyData} />
            <WindChart data={hourlyData} />
            <ParticleChart data={hourlyData} /> */}
            <TemperatureChart data={chartData} temperatureUnitLabel={temperatureUnitLabel} />
            <HumidityChart data={chartData} />
            <PrecipitationChart data={chartData} />
            <VisibilityChart data={chartData} />
            <WindChart data={chartData} />
            <ParticleChart data={chartData} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default DashboardPage