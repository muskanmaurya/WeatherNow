import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-950 via-indigo-950 to-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-md">
        <h1 className="text-6xl font-bold text-cyan-400">404</h1>
        <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">Lost in the clouds</h2>
        <p className="mt-3 text-slate-300">
          We couldn't find the weather page you're looking for. It seems to have drifted away.
        </p>
        
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-300"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage