import { Area, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChevronLeft, ChevronRight, Droplets } from 'lucide-react'


const HourlyCarousel = ({ data, temperatureUnitLabel, weatherData }) => {
  return (
    <section className="rounded-2xl border border-white/20 bg-[#2a305f]/85 p-4 shadow-lg backdrop-blur-sm md:col-span-2">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-xl font-semibold text-white">Overview</h3>
      <div className="flex items-center gap-3 text-sm text-slate-200">
      </div>
    </div>

    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#202a57]/60 p-3 sm:p-4">

      <div className="mb-3 grid grid-cols-12 gap-1 text-center">
        {data.map((point) => (
          <div key={point.id} className="min-w-0">
            <p className="text-[11px] text-slate-300">{point.slotLabel}</p>
            <p className="text-[11px] text-transparent">_</p>
            <p className="text-base leading-tight">{point.icon}</p>
            <p className="text-sm text-slate-100">{Math.round(point.temperature)}°</p>
          </div>
        ))}
      </div>

      <div className="h-64">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 10, bottom: 16, left: 4 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.12)" vertical={false} />
            <XAxis dataKey="slotLabel" hide />
            <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} width={40} domain={['dataMin - 8', 'dataMax + 10']} />
            <Tooltip
              formatter={(value) => [`${value} ${temperatureUnitLabel}`, 'Temperature']}
              contentStyle={{ backgroundColor: '#0f1f4f', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '0.75rem' }}
            />
            <defs>
              <linearGradient id="overviewTempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f87171" stopOpacity={0.55} />
                <stop offset="65%" stopColor="#fbbf24" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="temperature" stroke="none" fill="url(#overviewTempGradient)" />
            <Line type="monotone" dataKey="temperature" stroke="#fca5a5" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-2 mt-2 grid grid-cols-12 gap-1 text-center text-[11px] text-slate-200">
        {data.map((point) => (
          <div key={`rain-${point.id}`} className="rounded-lg bg-sky-500/35 py-1 font-medium">
            <Droplets size={12} className="mx-auto mb-0.5" />
            {point.precipitationProbability}%
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between text-sm text-slate-200">
        <p>
          <span className="text-amber-300">Sunset</span> {weatherData?.daily?.sunset ? new Date(weatherData.daily.sunset).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '6:17 PM'}
        </p>
        <p>
          <span className="text-yellow-200">Sunrise</span> {weatherData?.daily?.sunrise ? new Date(weatherData.daily.sunrise).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '5:52 AM'}
        </p>
      </div>
    </div>

    <div className="mt-3 flex items-center justify-between text-slate-200">
      <p className="text-sm">Temperature</p>
      {/* Note: Moon phase is currently static placeholder text as Open-Meteo does not provide specific moon phase. */}
      <p className="text-sm">
        Moon phase: <span className="font-semibold text-white">Waning Gibbous</span>
      </p>
    </div>
  </section>
  )
}

export default HourlyCarousel

