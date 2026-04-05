import React from 'react'

const SmallCard = () => {
  return (
    <div className="rounded-xl bg-slate-900/35 p-3">
                <p className="text-xs text-slate-300">Air Quality Index</p>
                <p className="text-2xl font-semibold">{"daily.aqi"}</p>
              </div>
  )
}

export default SmallCard