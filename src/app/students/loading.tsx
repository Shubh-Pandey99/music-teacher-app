export default function StudentsLoading() {
    return (
        <div className="space-y-6 pb-24 max-w-7xl mx-auto animate-pulse">
            {/* Header skeleton */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-muted" />
                        <div className="h-10 w-44 rounded-xl bg-muted/60" />
                    </div>
                    <div className="h-5 w-60 rounded-lg bg-muted/40 ml-12" />
                </div>
                <div className="h-10 w-36 rounded-xl bg-muted" />
            </div>

            {/* Students list skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-32 rounded-2xl bg-card border border-border p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-12 w-12 rounded-xl bg-muted" />
                            <div className="space-y-2">
                                <div className="h-5 w-32 bg-muted/60 rounded" />
                                <div className="h-4 w-24 bg-muted/40 rounded" />
                            </div>
                        </div>
                        <div className="h-8 w-full bg-muted/30 rounded mt-4" />
                    </div>
                ))}
            </div>
        </div>
    )
}
