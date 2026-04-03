import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export const ChartShell = ({ title, unit, children, className = '' }) => (
  <section className={`rounded-2xl border border-white/20 bg-white/8 p-4 shadow-lg backdrop-blur-sm ${className}`}>
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <span className="rounded-full bg-white/15 px-2 py-1 text-xs text-slate-100">{unit}</span>
    </div>
    <div className="h-52 w-full">{children}</div>
  </section>
)

export const TemperatureChart = ({ data, temperatureUnitLabel }) => (
  <ChartShell title="Temperature" unit={temperatureUnitLabel} className="md:col-span-2">
    <ResponsiveContainer>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
        <XAxis dataKey="time" tick={{ fill: '#e2e8f0', fontSize: 11 }} tickMargin={8} />
        <YAxis tick={{ fill: '#e2e8f0', fontSize: 11 }} width={44} />
        <Tooltip contentStyle={{ backgroundColor: '#0b2a66', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '0.75rem' }} />
        <Area type="monotone" dataKey="temperature" stroke="#f59e0b" fill="url(#tempFill)" strokeWidth={2.5} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  </ChartShell>
)

export const HumidityChart = ({ data }) => (
  <ChartShell title="Relative Humidity" unit="%">
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
        <XAxis dataKey="time" tick={{ fill: '#e2e8f0', fontSize: 11 }} tickMargin={8} />
        <YAxis tick={{ fill: '#e2e8f0', fontSize: 11 }} width={44} />
        <Tooltip contentStyle={{ backgroundColor: '#0b2a66', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '0.75rem' }} />
        <Line type="monotone" dataKey="humidity" stroke="#7dd3fc" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </ChartShell>
)

export const PrecipitationChart = ({ data }) => (
  <ChartShell title="Precipitation" unit="mm">
    <ResponsiveContainer>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
        <XAxis dataKey="time" tick={{ fill: '#e2e8f0', fontSize: 11 }} tickMargin={8} />
        <YAxis tick={{ fill: '#e2e8f0', fontSize: 11 }} width={44} />
        <Tooltip contentStyle={{ backgroundColor: '#0b2a66', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '0.75rem' }} />
        <Bar dataKey="precipitation" fill="#22d3ee" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </ChartShell>
)

export const VisibilityChart = ({ data }) => (
  <ChartShell title="Visibility" unit="km">
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
        <XAxis dataKey="time" tick={{ fill: '#e2e8f0', fontSize: 11 }} tickMargin={8} />
        <YAxis tick={{ fill: '#e2e8f0', fontSize: 11 }} width={44} />
        <Tooltip contentStyle={{ backgroundColor: '#0b2a66', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '0.75rem' }} />
        <Line type="monotone" dataKey="visibility" stroke="#bfdbfe" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </ChartShell>
)

export const WindChart = ({ data }) => (
  <ChartShell title="Wind Speed (10m)" unit="km/h">
    <ResponsiveContainer>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="windFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f9a8d4" stopOpacity={0.42} />
            <stop offset="100%" stopColor="#f9a8d4" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
        <XAxis dataKey="time" tick={{ fill: '#e2e8f0', fontSize: 11 }} tickMargin={8} />
        <YAxis tick={{ fill: '#e2e8f0', fontSize: 11 }} width={44} />
        <Tooltip contentStyle={{ backgroundColor: '#0b2a66', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '0.75rem' }} />
        <Area type="monotone" dataKey="windSpeed10m" stroke="#f9a8d4" fill="url(#windFill)" strokeWidth={2.5} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  </ChartShell>
)

export const ParticleChart = ({ data }) => (
  <ChartShell title="PM10 & PM2.5" unit="ug/m3" className="md:col-span-2">
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
        <XAxis dataKey="time" tick={{ fill: '#e2e8f0', fontSize: 11 }} tickMargin={8} />
        <YAxis tick={{ fill: '#e2e8f0', fontSize: 11 }} width={44} />
        <Tooltip contentStyle={{ backgroundColor: '#0b2a66', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '0.75rem' }} />
        <Legend wrapperStyle={{ color: '#f8fafc', fontSize: '12px' }} />
        <Line type="monotone" dataKey="pm10" name="PM10" stroke="#fbbf24" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="pm25" name="PM2.5" stroke="#a78bfa" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </ChartShell>
)
