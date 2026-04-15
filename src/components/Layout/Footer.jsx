const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full border-t border-slate-700 bg-transparent py-4 backdrop-blur-md mt-auto">
            <div className="w-full px-4 md:px-6 flex flex-col items-center justify-between space-y-2 text-center md:flex-row md:space-y-0">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                    <span>&copy; 2024 - {currentYear} Weather Now. All rights reserved.</span>
                </div>
                <div className="text-xs text-slate-400">
                    Designed & developed with <span className="text-red-500">♥</span> to keep you ahead of the weather.
                </div>
            </div>
        </footer>
    )
}

export default Footer
