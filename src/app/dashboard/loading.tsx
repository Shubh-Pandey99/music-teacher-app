
export default function DashboardLoading() {
    return (
        <div className="space-y-8 pb-24 max-w-7xl mx-auto">
            {/* Header skeleton */}
            <div className="space-y-2">
                <div className="h-10 w-48 rounded-xl animate-pulse" style={{ background: 'oklch(0.18 0.03 280)' }} />
                <div className="h-5 w-72 rounded-lg animate-pulse" style={{ background: 'oklch(0.15 0.025 280)' }} />
            </div>

            {/* Stat cards skeleton */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl p-6 animate-pulse"
                        style={{
                            background: i === 0
                                ? 'oklch(0.30 0.10 295 / 0.3)'
                                : 'oklch(0.16 0.03 280)',
                            border: '1px solid oklch(0.22 0.03 280)',
                            height: '140px'
                        }}
                    />
                ))}
            </div>

            {/* Content grid skeleton */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-2xl animate-pulse" style={{ background: 'oklch(0.13 0.025 280)', border: '1px solid oklch(0.22 0.03 280)', height: '400px' }} />
                </div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="rounded-2xl animate-pulse" style={{ background: 'oklch(0.13 0.025 280)', border: '1px solid oklch(0.22 0.03 280)', height: '80px' }} />
                    ))}
                </div>
            </div>
        </div>
    )
}
