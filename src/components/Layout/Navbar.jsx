import {Calendar, ArrowRight} from "lucide-react"
import { Link } from "react-router-dom";
import { useGeolocation } from '../../hooks/useGeolocation.js'
import { useState, useEffect } from "react";

const Navbar = ({selectedDate, onDateChange}) => {
  const { location, error } = useGeolocation();

  const [currentTime, setCurrentTime] = useState(new Date());
  
    useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
  
    return () => clearInterval(timer); // Cleanup on unmount
  }, []);
  
  const timeString = currentTime.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-cyan-100/90">Weather Dashboard</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">{location.city}</h1>
              <p className="mt-2 text-slate-200">{selectedDate}</p>
              <p className="mt-1 text-xl text-slate-100/95">{timeString}</p>
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
                  value={selectedDate}
                  onChange={(e)=>onDateChange(e.target.value)}
                  className="date-picker-input w-37 rounded-lg border border-white/25 bg-slate-950/60 px-3 py-2 pr-12 text-sm outline-none ring-cyan-300 transition focus:ring-2 "
                />
                <Calendar className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 translate-x-1/3 text-white" />
              </div>
              <Link
              to="/trends"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/20 mt-3"
            >
              Historical Trends
              <ArrowRight size={16} />
            </Link>
            </div>
          </div>
  )
}

export default Navbar;