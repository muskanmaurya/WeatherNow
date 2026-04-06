import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CalendarRange, LineChart, ShieldCheck } from 'lucide-react'
import { getTheme } from '../utils/getTheme.js'
import { themeClasses } from '../features/Dashboard/Services/WeatherEngine.js'
import DataRangePicker from '../features/Historical/components/DataRangePicker.jsx'
import TrendCharts from '../features/Historical/components/TrendCharts.jsx'
import ComparisonTable from '../features/Historical/components/ComparisonTable.jsx'
import {
  buildComparisonRows,
  daysBetween,
  historicalBounds,
  formatMinutesToIst,
  shiftDateKey,
  summariseHistoricalRange,
} from '../features/Historical/services/historicalEngine.js'
import { mapHistoricalData } from '../features/Historical/services/historicalMapper.js'
import { useGeolocation } from '../hooks/useGeolocation.js'
import { useHistoricalWeather } from '../hooks/useWeather.js'

const MAX_RANGE_DAYS = 730
const DEFAULT_RANGE_DAYS = 180

const HistoricalPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const startDate = searchParams.get('start') || ''
  const endDate = searchParams.get('end') || ''
  const [currentHour, setCurrentHour] = useState(new Date().getHours())
  const [zoomWindow, setZoomWindow] = useState({ startIndex: 0, endIndex: DEFAULT_RANGE_DAYS - 1 })

  const { location } = useGeolocation();

  // Use the custom hook to fetch historical weather and AQI data based on location and selected date range
  const { weatherArchiveResult, aqiArchiveResult, isLoading } = useHistoricalWeather(location.lat, location.lon, startDate, endDate);

  // Map the raw API results into the format our component expects
  const selectedRecords = useMemo(() => {
    if (weatherArchiveResult && aqiArchiveResult) {
      return mapHistoricalData(weatherArchiveResult, aqiArchiveResult);
    }
    return [];
  }, [weatherArchiveResult, aqiArchiveResult]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHour(new Date().getHours())
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  const activeTheme = getTheme(currentHour)

  useEffect(() => {
    if (!selectedRecords.length) return
    setZoomWindow({
      startIndex: 0,
      endIndex: selectedRecords.length - 1,
    })
  }, [selectedRecords.length])

  const visibleRecords = useMemo(
    () => selectedRecords.slice(zoomWindow.startIndex, zoomWindow.endIndex + 1),
    [selectedRecords, zoomWindow],
  )

  const summary = useMemo(() => summariseHistoricalRange(visibleRecords), [visibleRecords])
  const comparisonRows = useMemo(() => buildComparisonRows(visibleRecords), [visibleRecords])

  const handleRangeChange = ({ field, value }) => {
    let nextStart = startDate
    let nextEnd = endDate

    if (field === 'startDate') {
      nextStart = value
    }

    if (field === 'endDate') {
      nextEnd = value
    }

    // Apply validation only if both dates exist
    if (nextStart && nextEnd) {
      if (nextStart > nextEnd) {
        if (field === 'startDate') nextEnd = nextStart
        else nextStart = nextEnd
      }
      if (daysBetween(nextStart, nextEnd) >= MAX_RANGE_DAYS) {
        if (field === 'startDate') nextEnd = shiftDateKey(nextStart, MAX_RANGE_DAYS - 1)
        else nextStart = shiftDateKey(nextEnd, -(MAX_RANGE_DAYS - 1))
      }
    }

    if (nextStart && nextStart < historicalBounds.minDate) {
      nextStart = historicalBounds.minDate
    }

    if (nextEnd && nextEnd > historicalBounds.maxDate) {
      nextEnd = historicalBounds.maxDate
    }

    setSearchParams({ start: nextStart, end: nextEnd })
  }

  const handlePreset = (days) => {
    const clampedDays = Math.min(days, MAX_RANGE_DAYS)
    const nextEnd = historicalBounds.maxDate
    const nextStart = shiftDateKey(nextEnd, -(clampedDays - 1))

    setSearchParams({ 
      start: nextStart < historicalBounds.minDate ? historicalBounds.minDate : nextStart, 
      end: nextEnd 
    })
  }

  const handleResetZoom = () => {
    setZoomWindow({
      startIndex: 0,
      endIndex: selectedRecords.length - 1,
    })
  }

  const handleZoomIn = () => {
    if (!selectedRecords.length) return

    const currentSize = zoomWindow.endIndex - zoomWindow.startIndex + 1
    const nextSize = Math.max(14, Math.floor(currentSize * 0.65))
    const center = Math.floor((zoomWindow.startIndex + zoomWindow.endIndex) / 2)
    const halfWindow = Math.floor(nextSize / 2)
    let nextStart = Math.max(0, center - halfWindow)
    let nextEnd = Math.min(selectedRecords.length - 1, nextStart + nextSize - 1)
    nextStart = Math.max(0, nextEnd - nextSize + 1)

    setZoomWindow({ startIndex: nextStart, endIndex: nextEnd })
  }

  const handleZoomOut = () => {
    if (!selectedRecords.length) return

    const currentSize = zoomWindow.endIndex - zoomWindow.startIndex + 1
    const nextSize = Math.min(selectedRecords.length, Math.ceil(currentSize * 1.5))
    const center = Math.floor((zoomWindow.startIndex + zoomWindow.endIndex) / 2)
    const halfWindow = Math.floor(nextSize / 2)
    let nextStart = Math.max(0, center - halfWindow)
    let nextEnd = Math.min(selectedRecords.length - 1, nextStart + nextSize - 1)
    nextStart = Math.max(0, nextEnd - nextSize + 1)

    setZoomWindow({ startIndex: nextStart, endIndex: nextEnd })
  }

  const handleBrushChange = ({ startIndex, endIndex }) => {
    if (typeof startIndex !== 'number' || typeof endIndex !== 'number') return
    setZoomWindow({ startIndex, endIndex })
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${themeClasses[activeTheme]} bg-cover bg-center p-4 text-slate-100 transition-colors duration-1000`}>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-white/15 bg-black/5 p-5 shadow-2xl backdrop-blur-md sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm text-cyan-100/90">
                <ShieldCheck size={16} />
                Historical trends
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Long-term weather analysis</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-200 sm:text-base">
                Explore temperature, sun cycle, precipitation, wind, and air quality trends across a historical window of up to 2 years.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/20 sm:w-auto"
            >
              <ArrowLeft size={16} />
              Back to dashboard
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-sm text-cyan-100">Range length</p>
              <p className="mt-2 text-4xl font-semibold">{summary?.rangeLength ?? 0}</p>
              <p className="text-sm text-slate-200">Days currently selected</p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="flex items-center gap-2 text-sm text-cyan-100">
                <LineChart size={16} />
                Mean temperature
              </p>
              <p className="mt-2 text-4xl font-semibold">{summary?.meanTemp ?? '--'}° C</p>
              <p className="text-sm text-slate-200">Min {summary?.minTemp ?? '--'}° C | Max {summary?.maxTemp ?? '--'}° C</p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="flex items-center gap-2 text-sm text-cyan-100">
                <CalendarRange size={16} />
                Sun cycle
              </p>
              <p className="mt-2 text-sm text-slate-200">Sunrise: {summary ? formatMinutesToIst(summary.avgSunriseMinutes) : '--'}</p>
              <p className="mt-1 text-sm text-slate-200">Sunset: {summary ? formatMinutesToIst(summary.avgSunsetMinutes) : '--'}</p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-sm text-cyan-100">Air quality</p>
              <p className="mt-2 text-sm text-slate-200">PM10: {summary?.meanPm10 ?? '--'} ug/m3</p>
              <p className="mt-1 text-sm text-slate-200">PM2.5: {summary?.meanPm25 ?? '--'} ug/m3</p>
              <p className="mt-1 text-sm text-slate-300">Dominant wind: {summary?.dominantWindDirection ?? '--'}</p>
            </div>
          </div>
        </section>

        <div className="mt-7 space-y-6">
          <DataRangePicker
            startDate={startDate}
            endDate={endDate}
            minDate={historicalBounds.minDate}
            maxDate={historicalBounds.maxDate}
            maxRangeDays={MAX_RANGE_DAYS}
            onChange={handleRangeChange}
            onPreset={handlePreset}
            onReset={handleResetZoom}
          />

          {isLoading && startDate && endDate ? (
            <div className="flex h-64 items-center justify-center rounded-3xl border border-white/15 bg-white/5">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"></div>
            </div>
          ) : !startDate || !endDate ? (
            <div className="flex flex-col h-64 items-center justify-center rounded-3xl border border-white/15 bg-white/5 p-6 text-center">
              <CalendarRange size={48} className="mb-4 text-cyan-50/50" />
              <h3 className="text-xl font-semibold text-white">No Date Selected</h3>
              <p className="mt-2 text-sm text-slate-300">
                Please pick a start and end date from the calendar to explore historical weather trends safely.
              </p>
            </div>
          ) : (
            <>
              <TrendCharts
                fullData={selectedRecords}
                visibleData={visibleRecords}
                zoomWindow={zoomWindow}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetZoom={handleResetZoom}
                onBrushChange={handleBrushChange}
              />

              <ComparisonTable summary={summary} records={visibleRecords} comparisonRows={comparisonRows} />
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default HistoricalPage