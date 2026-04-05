import {
	Bar,
	BarChart,
	CartesianGrid,
	Brush,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import {
	formatLongDateLabel,
	formatMinutesToIst,
	formatShortDateLabel,
	getDirectionDistribution,
} from '../services/historicalEngine.js'

const chartColors = {
	mean: '#67e8f9',
	max: '#f59e0b',
	min: '#a78bfa',
	precipitation: '#38bdf8',
	wind: '#f97316',
	pm10: '#fb7185',
	pm25: '#22c55e',
}

const ChartShell = ({ title, subtitle, children, scrollable = false, dataLength = 0 }) => (
	<section className="min-w-0 rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-md sm:p-5">
		<div className="flex flex-wrap items-start justify-between gap-3">
			<div>
				<h3 className="text-lg font-semibold text-white">{title}</h3>
				<p className="mt-1 text-sm text-slate-200">{subtitle}</p>
			</div>
		</div>
		<div className={`mt-4 w-full ${scrollable ? 'overflow-x-auto overflow-y-hidden styled-scrollbar' : ''}`}>
			<div style={{ minWidth: scrollable ? Math.max(100, dataLength * 45) + 'px' : '100%' }}>
				{children}
			</div>
		</div>
	</section>
)

const chartTooltipStyle = {
	contentStyle: {
		background: 'rgba(15, 23, 42, 0.95)',
		border: '1px solid rgba(255, 255, 255, 0.12)',
		borderRadius: '16px',
		color: '#e2e8f0',
	},
	labelStyle: {
		color: '#f8fafc',
		fontWeight: 600,
	},
}

const axisTickStyle = {
	fill: '#f8fafc',
	fontSize: 12,
}

const formatCurrencyLikeNumber = (value, unit = '') => `${value}${unit}`

const BrushChart = ({ data, zoomWindow, onBrushChange }) => (
	<section className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-md sm:p-5">
		<div className="flex flex-wrap items-center justify-between gap-3">
			<div>
				<h3 className="text-lg font-semibold text-white">Timeline zoom</h3>
				<p className="mt-1 text-sm text-slate-200">Use the brush or zoom controls to focus on a specific timeframe.</p>
			</div>
			<div className="rounded-full border border-white/15 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
				Showing {zoomWindow.endIndex - zoomWindow.startIndex + 1} of {data.length} days
			</div>
		</div>

		<div className="mt-4 h-28 w-full">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={data}>
					<CartesianGrid stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4 4" />
					<XAxis dataKey="dateKey" tickFormatter={formatShortDateLabel} minTickGap={18} tick={axisTickStyle} />
					<YAxis hide />
					<Tooltip
						{...chartTooltipStyle}
						labelFormatter={formatLongDateLabel}
						formatter={(value) => [value, 'Mean temperature']}
					/>
					<Line type="monotone" dataKey="tempMean" stroke={chartColors.mean} dot={false} strokeWidth={2} />
					<Brush
						dataKey="dateKey"
						height={18}
						travellerWidth={12}
						startIndex={zoomWindow.startIndex}
						endIndex={zoomWindow.endIndex}
						onChange={(range) => {
							if (!range) return
							onBrushChange({
								startIndex: range.startIndex ?? 0,
								endIndex: range.endIndex ?? data.length - 1,
							})
						}}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	</section>
)

const TrendCharts = ({
	fullData,
	visibleData,
	zoomWindow,
	onZoomIn,
	onZoomOut,
	onResetZoom,
	onBrushChange,
}) => {

	// Wheel-based zoom: scroll up -> zoom in, scroll down -> zoom out.
	const handleWheel = (e) => {
		e.preventDefault()
		if (!e.deltaY && !e.deltaX) return
		if (e.deltaY < 0) {
			onZoomIn()
		} else if (e.deltaY > 0) {
			onZoomOut()
		}
	}
	const directionDistribution = getDirectionDistribution(visibleData)

	return (
		<section className="space-y-4" onWheel={handleWheel}>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight text-white">Historical charts</h2>
					<p className="mt-1 text-sm text-slate-200">
						Long-term trends stay aligned across all charts, with the selected range centered around the same timeframe.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<button
						type="button"
						onClick={onZoomOut}
						className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/20"
					>
						<ZoomOut size={16} />
						Zoom out
					</button>
					<button
						type="button"
						onClick={onZoomIn}
						className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/20"
					>
						<ZoomIn size={16} />
						Zoom in
					</button>
					<button
						type="button"
						onClick={onResetZoom}
						className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-50 transition hover:bg-cyan-300/20"
					>
						<RotateCcw size={16} />
						Reset
					</button>
				</div>
			</div>

			<BrushChart data={fullData} zoomWindow={zoomWindow} onBrushChange={onBrushChange} />

			<div className="grid gap-4 xl:grid-cols-2">
				<ChartShell title="Temperature trends" subtitle="Mean, max, and min temperatures across the selected range." scrollable={true} dataLength={visibleData.length}>
					<ResponsiveContainer width="100%" height={290}>
						<LineChart data={visibleData} syncId="historical-trends">
							<CartesianGrid stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4 4" />
							<XAxis dataKey="dateKey" tickFormatter={formatShortDateLabel} minTickGap={18} tick={axisTickStyle} />
							<YAxis tick={axisTickStyle} />
							<Tooltip {...chartTooltipStyle} labelFormatter={formatLongDateLabel} />
							<Legend />
							<Line type="monotone" dataKey="tempMean" name="Mean" stroke={chartColors.mean} dot={false} strokeWidth={2} />
							<Line type="monotone" dataKey="tempMax" name="Max" stroke={chartColors.max} dot={false} strokeWidth={2} />
							<Line type="monotone" dataKey="tempMin" name="Min" stroke={chartColors.min} dot={false} strokeWidth={2} />
						</LineChart>
					</ResponsiveContainer>
				</ChartShell>

				<ChartShell title="Sun cycle" subtitle="Sunrise and sunset are shown in IST to keep the timeline consistent." scrollable={true} dataLength={visibleData.length}>
					<ResponsiveContainer width="100%" height={290}>
						<LineChart data={visibleData} syncId="historical-trends">
							<CartesianGrid stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4 4" />
							<XAxis dataKey="dateKey" tickFormatter={formatShortDateLabel} minTickGap={18} tick={axisTickStyle} />
							<YAxis tickFormatter={formatMinutesToIst} domain={['dataMin - 20', 'dataMax + 20']} width={88} tick={axisTickStyle} />
							<Tooltip
								{...chartTooltipStyle}
								labelFormatter={formatLongDateLabel}
								formatter={(value, name) => [formatMinutesToIst(value), name]}
							/>
							<Legend />
							<Line type="monotone" dataKey="sunriseMinutes" name="Sunrise" stroke="#fbbf24" dot={false} strokeWidth={2} />
							<Line type="monotone" dataKey="sunsetMinutes" name="Sunset" stroke="#fb7185" dot={false} strokeWidth={2} />
						</LineChart>
					</ResponsiveContainer>
				</ChartShell>

				<ChartShell title="Precipitation" subtitle="Total precipitation for each day in the selected range." scrollable={true} dataLength={visibleData.length}>
					<ResponsiveContainer width="100%" height={290}>
						<BarChart data={visibleData} syncId="historical-trends">
							<CartesianGrid stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4 4" />
							<XAxis dataKey="dateKey" tickFormatter={formatShortDateLabel} minTickGap={18} tick={axisTickStyle} />
							<YAxis tick={axisTickStyle} />
							<Tooltip
								{...chartTooltipStyle}
								labelFormatter={formatLongDateLabel}
								formatter={(value) => [formatCurrencyLikeNumber(value, ' mm'), 'Precipitation']}
							/>
							<Bar dataKey="precipitationTotal" name="Precipitation" fill={chartColors.precipitation} radius={[8, 8, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</ChartShell>

				<ChartShell title="Wind speed" subtitle="Maximum wind speed per day with the most common direction summarized alongside it." scrollable={true} dataLength={visibleData.length}>
					<ResponsiveContainer width="100%" height={290}>
						<LineChart data={visibleData} syncId="historical-trends">
							<CartesianGrid stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4 4" />
							<XAxis dataKey="dateKey" tickFormatter={formatShortDateLabel} minTickGap={18} tick={axisTickStyle} />
							<YAxis tick={axisTickStyle} />
							<Tooltip
								{...chartTooltipStyle}
								labelFormatter={formatLongDateLabel}
								formatter={(value) => [formatCurrencyLikeNumber(value, ' km/h'), 'Max wind speed']}
							/>
							<Line type="monotone" dataKey="maxWindSpeed" name="Max wind speed" stroke={chartColors.wind} dot={false} strokeWidth={2} />
						</LineChart>
					</ResponsiveContainer>

					<div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<div>
								<p className="text-sm text-slate-300">Dominant wind direction</p>
								<p className="mt-1 text-2xl font-semibold text-white">
									{directionDistribution.reduce((best, current) => (current.count > best.count ? current : best), directionDistribution[0]).direction}
								</p>
							</div>
							<p className="text-sm text-slate-300">
								Appears {directionDistribution.reduce((best, current) => (current.count > best.count ? current : best), directionDistribution[0]).count} times
							</p>
						</div>

						<div className="mt-4 w-full">
							<ResponsiveContainer width="100%" height={220}>
								<BarChart data={directionDistribution}>
									<CartesianGrid stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4 4" />
									<XAxis dataKey="direction" tick={axisTickStyle} />
									<YAxis allowDecimals={false} tick={axisTickStyle} />
									<Tooltip {...chartTooltipStyle} formatter={(value) => [value, 'Days']} />
									<Bar dataKey="count" name="Days" fill={chartColors.wind} radius={[8, 8, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
				</ChartShell>

				<ChartShell title="Air quality" subtitle="PM10 and PM2.5 trends across the selected historical window." scrollable={true} dataLength={visibleData.length}>
					<ResponsiveContainer width="100%" height={290}>
						<LineChart data={visibleData} syncId="historical-trends">
							<CartesianGrid stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4 4" />
							<XAxis dataKey="dateKey" tickFormatter={formatShortDateLabel} minTickGap={18} tick={axisTickStyle} />
							<YAxis tick={axisTickStyle} />
							<Tooltip
								{...chartTooltipStyle}
								labelFormatter={formatLongDateLabel}
								formatter={(value, name) => [formatCurrencyLikeNumber(value, ' ug/m3'), name]}
							/>
							<Legend />
							<Line type="monotone" dataKey="pm10" name="PM10" stroke={chartColors.pm10} dot={false} strokeWidth={2} />
							<Line type="monotone" dataKey="pm25" name="PM2.5" stroke={chartColors.pm25} dot={false} strokeWidth={2} />
						</LineChart>
					</ResponsiveContainer>
				</ChartShell>
			</div>
		</section>
	)
}

export default TrendCharts
