
export default function DashboardLoading() {
    return (
        <div className="space-y-8 pb-24 max-w-7xl mx-auto animate-pulse">
            {/* Header skeleton */}
            <div className="space-y-2">
                <div className="h-10 w-48 rounded-xl bg-muted/60" />
                <div className="h-5 w-72 rounded-lg bg-muted/40" />
            </div>

            {/* Stat cards skeleton */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl p-6 bg-card border border-border"
                        style={{ height: '140px' }}
                    >
                        <div className="h-4 w-24 bg-muted/50 rounded mb-4" />
                        <div className="h-10 w-32 bg-muted rounded mb-2" />
                        <div className="h-3 w-40 bg-muted/40 rounded" />
                    </div>
                ))}
            </div>

            {/* Content grid skeleton */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-2xl bg-card border border-border" style={{ height: '400px' }} />
                </div>
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-2xl bg-card border border-border" style={{ height: '80px' }} />
                    ))}
                </div>
            </div>
        </div>
    )
}
