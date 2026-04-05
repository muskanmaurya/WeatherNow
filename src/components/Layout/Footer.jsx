const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <>
        {/* <footer className="w-full border-t border-white/10 bg-slate-950/40 py-6 backdrop-blur-md">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0 text-center">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        <span>&copy; {currentYear} Weather Now. All rights reserved.</span>
                    </div>
                    <div className="text-xs text-slate-400">
                        Designed & developed with <span className="text-red-500">♥</span> to keep you ahead of the weather.
                    </div>
                </div>
            </div>
        </footer> */}
        </>
    )
}

export default Footer
