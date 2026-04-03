import {Calendar} from "lucide-react"

const Navbar = () => {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-cyan-100/90">Weather Dashboard</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">{"daily.location mudpar"}</h1>
              <p className="mt-2 text-slate-200">{"selectedDateLabel friday 3 april 2023"}</p>
              <p className="mt-1 text-xl text-slate-100/95">{"daily.condition partly cloudy"}</p>
            </div>

            <div className="p-1">
              <label htmlFor="date-picker" >
              </label>
              <div className="relative w-35">
                <input
                  id="date-picker"
                  type="date"
                  min={"availableDates[0]"}
                  max={"availableDates[availableDates.length - 1]"}
                  value={"selectedDate"}
                  // onChange={(event) => setSelectedDate(event.target.value)}
                  className="date-picker-input w-37 rounded-lg border border-white/25 bg-slate-950/60 px-3 py-2 pr-12 text-sm outline-none ring-cyan-300 transition focus:ring-2 "
                />
                <Calendar className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 translate-x-1/3 text-white" />
              </div>
            </div>
          </div>
  )
}

export default Navbar;