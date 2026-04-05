import React from 'react'

const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-950 via-indigo-950 to-slate-950 px-4 text-white">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-md sm:p-8">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent sm:h-14 sm:w-14"></div>
        <h2 className="text-lg font-semibold sm:text-xl">Syncing with satellites...</h2>
        <p className="mt-2 text-sm text-slate-300 sm:text-base">Fetching live data for {location.city}</p>
      </div>
    </div>
  )
}

export default Loader