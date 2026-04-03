import { CalendarDays, Droplets, Wind } from 'lucide-react'
import { formatMinutesToIst } from '../services/historicalApi.js'

const ComparisonTable = ({ summary, records, comparisonRows }) => {
	if (!summary || !records.length) {
		return null
	}

	return (
		<section className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<p className="text-sm text-cyan-100/90">Range summary</p>
					<h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">Compare the selected period</h2>
					<p className="mt-2 max-w-2xl text-sm text-slate-200">
						This view condenses the selected range into a few clear metrics so the charts stay readable on smaller screens.
					</p>
				</div>

				<div className="rounded-full border border-white/15 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
					{summary.rangeLength} days analysed
				</div>
			</div>

			<div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
					<p className="flex items-center gap-2 text-sm text-slate-300">
						<CalendarDays size={16} />
						Range
					</p>
					<p className="mt-2 text-base font-semibold text-white">{summary.startDate}</p>
					<p className="text-sm text-slate-300">to {summary.endDate}</p>
				</div>

				<div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
					<p className="text-sm text-slate-300">Mean temperature</p>
					<p className="mt-2 text-3xl font-semibold text-white">{summary.meanTemp}° C</p>
					<p className="text-sm text-slate-300">Min {summary.minTemp}° C | Max {summary.maxTemp}° C</p>
				</div>

				<div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
					<p className="flex items-center gap-2 text-sm text-slate-300">
						<Droplets size={16} />
						Precipitation total
					</p>
					<p className="mt-2 text-3xl font-semibold text-white">{summary.totalPrecipitation} mm</p>
					<p className="text-sm text-slate-300">Average sunrise {formatMinutesToIst(summary.avgSunriseMinutes)}</p>
				</div>

				<div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
					<p className="flex items-center gap-2 text-sm text-slate-300">
						<Wind size={16} />
						Wind + air
					</p>
					<p className="mt-2 text-3xl font-semibold text-white">{summary.maxWindSpeed} km/h</p>
					<p className="text-sm text-slate-300">
						Dominant direction {summary.dominantWindDirection} • PM2.5 {summary.meanPm25} ug/m3
					</p>
				</div>
			</div>

			<div className="mt-5 overflow-x-auto">
				<table className="min-w-[760px] w-full border-separate border-spacing-y-3 text-left">
					<thead>
						<tr className="text-sm text-slate-300">
							<th className="px-3">Metric</th>
							<th className="px-3">Start</th>
							<th className="px-3">End</th>
							<th className="px-3">Change</th>
						</tr>
					</thead>
					<tbody>
						{comparisonRows.map((row) => (
							<tr key={row.label} className="rounded-2xl bg-slate-950/35 text-sm text-slate-100">
								<td className="rounded-l-2xl px-3 py-3 font-medium">{row.label}</td>
								<td className="px-3 py-3">{row.start}</td>
								<td className="px-3 py-3">{row.end}</td>
								<td className="rounded-r-2xl px-3 py-3 text-cyan-100">{row.change}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	)
}

export default ComparisonTable
