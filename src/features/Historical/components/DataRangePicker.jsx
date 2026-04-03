import { CalendarRange, RotateCcw } from 'lucide-react'

const PRESETS = [
	{ label: '30D', days: 30 },
	{ label: '90D', days: 90 },
	{ label: '1Y', days: 365 },
	{ label: '2Y', days: 730 },
]

const DataRangePicker = ({
	startDate,
	endDate,
	minDate,
	maxDate,
	maxRangeDays,
	onChange,
	onPreset,
	onReset,
	error,
}) => {
	const rangeLabel = `${startDate} to ${endDate}`

	return (
		<section className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<p className="text-sm text-cyan-100/90">Historical analysis</p>
					<h2 className="mt-1 text-2xl font-semibold tracking-tight">Select a range up to 2 years</h2>
					<p className="mt-2 max-w-2xl text-sm text-slate-200">
						Compare long-term weather trends with a range that stays within the available historical window.
					</p>
				</div>

				<div className="rounded-full border border-white/15 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
					Max span {maxRangeDays} days
				</div>
			</div>

			<div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1fr_auto]">
				<label className="space-y-2">
					<span className="flex items-center gap-2 text-sm text-slate-200">
						<CalendarRange size={16} />
						Start date
					</span>
					<input
						type="date"
						value={startDate}
						min={minDate}
						max={maxDate}
						onChange={(event) => onChange({ field: 'startDate', value: event.target.value })}
						className="w-full rounded-2xl border border-white/20 bg-slate-950/60 px-4 py-3 text-base text-white outline-none ring-cyan-300 transition focus:ring-2"
					/>
				</label>

				<label className="space-y-2">
					<span className="flex items-center gap-2 text-sm text-slate-200">
						<CalendarRange size={16} />
						End date
					</span>
					<input
						type="date"
						value={endDate}
						min={minDate}
						max={maxDate}
						onChange={(event) => onChange({ field: 'endDate', value: event.target.value })}
						className="w-full rounded-2xl border border-white/20 bg-slate-950/60 px-4 py-3 text-base text-white outline-none ring-cyan-300 transition focus:ring-2"
					/>
				</label>

				<div className="flex flex-wrap items-end gap-2 xl:justify-end">
					{PRESETS.map((preset) => (
						<button
							key={preset.label}
							type="button"
							onClick={() => onPreset(preset.days)}
							className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/20"
						>
							{preset.label}
						</button>
					))}

					<button
						type="button"
						onClick={onReset}
						className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-50 transition hover:bg-cyan-300/20"
					>
						<RotateCcw size={16} />
						Reset zoom
					</button>
				</div>
			</div>

			<div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-200">
				<span>Selected range: {rangeLabel}</span>
				<span>All charts support horizontal scroll and zoom controls.</span>
			</div>

			{error ? (
				<p className="mt-3 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
					{error}
				</p>
			) : null}
		</section>
	)
}

export default DataRangePicker
