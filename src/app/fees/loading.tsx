export default function FeesLoading() {
    return (
        <div className="space-y-5 pb-24 max-w-7xl mx-auto animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center justify-between gap-3">
                <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-muted" />
                        <div className="h-10 w-32 rounded-xl bg-muted/60" />
                    </div>
                    <div className="h-5 w-32 rounded-lg bg-muted/40 ml-11" />
                </div>
                <div className="h-10 w-36 rounded-xl bg-muted" />
            </div>

            {/* Summary cards skeleton */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-32 rounded-2xl bg-card border border-border p-5">
                        <div className="h-4 w-20 bg-muted/50 rounded mb-3" />
                        <div className="h-8 w-32 bg-muted rounded mb-2" />
                        <div className="h-3 w-28 bg-muted/40 rounded" />
                    </div>
                ))}
            </div>

            {/* Main grid skeleton */}
            <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted/30 rounded ml-0.5 mb-2" />
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-[72px] rounded-xl border border-border bg-card" />
                    ))}
                </div>
                <div className="h-[400px] rounded-2xl border border-border bg-card" />
            </div>
        </div>
    )
}
