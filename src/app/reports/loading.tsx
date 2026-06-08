export default function ReportsLoading() {
    return (
        <div className="space-y-6 pb-24 max-w-7xl mx-auto animate-pulse">
            {/* Header skeleton */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-muted" />
                        <div className="h-10 w-40 rounded-xl bg-muted/60" />
                    </div>
                    <div className="h-5 w-56 rounded-lg bg-muted/40 ml-12" />
                </div>
                <div className="h-10 w-48 rounded-2xl bg-muted" />
            </div>

            {/* Summary cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 rounded-2xl bg-card border border-border p-5">
                        <div className="h-4 w-24 bg-muted/50 rounded mb-3" />
                        <div className="h-8 w-28 bg-muted rounded mb-2" />
                        <div className="h-3 w-32 bg-muted/40 rounded" />
                    </div>
                ))}
            </div>

            {/* Table skeleton */}
            <div className="h-[400px] rounded-2xl border border-border bg-card" />
        </div>
    )
}
