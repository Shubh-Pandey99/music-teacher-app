export default function AttendanceLoading() {
    return (
        <div className="space-y-6 pb-24 max-w-7xl mx-auto animate-pulse">
            {/* Page Header skeleton */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-muted" />
                    <div className="h-10 w-48 rounded-xl bg-muted/60" />
                </div>
                <div className="h-5 w-64 rounded-lg bg-muted/40 ml-12" />
            </div>

            <div className="flex flex-col lg:flex-row gap-5">
                {/* Calendar skeleton */}
                <div className="w-full lg:w-[320px] h-[350px] rounded-2xl border border-border bg-card shrink-0" />

                {/* Students skeleton */}
                <div className="flex-1 space-y-4">
                    <div className="h-20 w-full rounded-2xl border border-border bg-card" />
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-[72px] w-full rounded-xl border border-border bg-card" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
