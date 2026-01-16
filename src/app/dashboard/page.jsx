import { CircularProgress } from "@/components/ui/circular-progress";

export default function DashboardPage() {
    return (
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2 italic">Dashboard</h1>
                    <p className="text-muted-foreground text-lg">Your engineering trajectory is looking sharp.</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 rounded-lg bg-accent border border-border flex flex-col items-center min-w-[100px]">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Streak</span>
                        <span className="text-xl font-bold italic">12 Days</span>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
                {/* Primary Progress */}
                <div className="lg:col-span-8 p-8 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                        <div className="shrink-0">
                            <CircularProgress value={83} radius={70} stroke={12} color="text-foreground" label="Overall" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Readiness Score</h2>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                You've mastered 83% of the Core DSA track. Your strongest areas are <span className="text-foreground font-medium">Linked Lists</span> and <span className="text-foreground font-medium">Heaps</span>.
                            </p>
                            <button className="px-6 py-2 bg-foreground text-background rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
                                View Detail Report
                            </button>
                        </div>
                    </div>
                </div>

                {/* Secondary Stats */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <StatCard label="Consistency" value="65%" subtext="+5% from last week" />
                    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Active Track</h3>
                            <p className="text-2xl font-bold mb-1 italic uppercase tracking-tighter">Data Structures</p>
                            <p className="text-sm text-muted-foreground">Next: Graph Theory</p>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="flex h-1.5 w-full bg-muted rounded-full overflow-hidden mr-4">
                                <div className="h-full bg-foreground rounded-full" style={{ width: '65%' }} />
                            </div>
                            <span className="text-xs font-bold font-mono">65%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Milestone */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold italic uppercase tracking-wider">Next Milestone</h2>
                    <span className="text-xs text-muted-foreground font-mono">Estimated: 45m</span>
                </div>
                <div className="group p-1 rounded-2xl bg-linear-to-r from-gray-200 via-gray-400 to-gray-200 dark:from-neutral-800 dark:via-neutral-600 dark:to-neutral-800 animate-gradient-x hover:scale-[1.005] transition-transform">
                    <div className="bg-card rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-foreground text-background font-bold tracking-widest uppercase">High Priority</span>
                                <span className="text-xs text-muted-foreground">Module 14</span>
                            </div>
                            <h3 className="text-2xl font-bold">BFS Implementation & Applications</h3>
                            <p className="text-muted-foreground mt-2">Master the breadth-first search logic on adjacency lists and matrices.</p>
                        </div>
                        <button className="w-full md:w-auto px-8 py-3 bg-foreground text-background rounded-xl font-bold hover:shadow-xl transition-all">
                            RESUME MODULE
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

function StatCard({ label, value, subtext }) {
    return (
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm group">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">{label}</h3>
            <p className="text-4xl font-bold italic tracking-tighter mb-2">{value}</p>
            <p className="text-xs text-muted-foreground font-medium">{subtext}</p>
        </div>
    )
}
