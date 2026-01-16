import { CircularProgress } from "@/components/ui/circular-progress";
import { auth } from "@/auth";
import { getDashboardData } from "@/lib/dashboard-data";
import { RecommendationCard } from "@/components/recommendation-card";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login/oauth");
    }

    const { user, progress, recommendations, topTopics, nextMilestone, stats } = await getDashboardData(session.user.id);

    const showProgressReport = stats.readinessScore >= 30;

    return (
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2 italic">Dashboard</h1>
                    <p className="text-muted-foreground text-lg">
                        {showProgressReport
                            ? "Your engineering trajectory is looking sharp."
                            : "Let's build your foundation with personalized recommendations."}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 rounded-lg bg-accent border border-border flex flex-col items-center min-w-[100px]">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Streak</span>
                        <span className="text-xl font-bold italic">{stats.streak} Days</span>
                    </div>
                </div>
            </div>

            {showProgressReport ? (
                <>
                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
                        {/* Primary Progress */}
                        <div className="lg:col-span-8 p-8 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                                <div className="shrink-0">
                                    <CircularProgress value={stats.readinessScore} radius={70} stroke={12} color="text-foreground" label="Overall" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Readiness Score</h2>
                                    <p className="text-muted-foreground mb-6 max-w-md">
                                        {topTopics.length > 0 ? (
                                            <>
                                                You've mastered {stats.readinessScore}% of your learning track. Your strongest areas are{" "}
                                                {topTopics.slice(0, 2).map((topic, idx) => (
                                                    <span key={idx}>
                                                        <span className="text-foreground font-medium">{topic}</span>
                                                        {idx < topTopics.length - 2 && idx < 1 ? " and " : ""}
                                                    </span>
                                                ))}
                                                .
                                            </>
                                        ) : (
                                            "Start practicing to see your progress and strongest areas."
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Stats */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <StatCard label="Consistency" value={`${stats.consistency}%`} subtext="Based on practice frequency" />
                            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Active Track</h3>
                                    <p className="text-2xl font-bold mb-1 italic uppercase tracking-tighter">
                                        {stats.activeTrack || "Not Set"}
                                    </p>
                                    {progress.length > 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            Next: {progress[0]?.topics?.name || "Continue Learning"}
                                        </p>
                                    )}
                                </div>
                                {progress.length > 0 && (
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex h-1.5 w-full bg-muted rounded-full overflow-hidden mr-4">
                                            <div className="h-full bg-foreground rounded-full" style={{ width: `${stats.readinessScore}%` }} />
                                        </div>
                                        <span className="text-xs font-bold font-mono">{stats.readinessScore}%</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Next Milestone */}
                    {nextMilestone && (
                        <section className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold italic uppercase tracking-wider">Next Milestone</h2>
                            </div>
                            <div className="group p-1 rounded-2xl bg-linear-to-r from-gray-200 via-gray-400 to-gray-200 dark:from-neutral-800 dark:via-neutral-600 dark:to-neutral-800 hover:scale-[1.005] transition-transform">
                                <div className="bg-card rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 rounded text-[10px] bg-foreground text-background font-bold tracking-widest uppercase">
                                                {nextMilestone.difficulty}
                                            </span>
                                            <span className="text-xs text-muted-foreground uppercase">{nextMilestone.source}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold">{nextMilestone.title}</h3>
                                        <p className="text-muted-foreground mt-2">{nextMilestone.description}</p>
                                    </div>
                                    <a
                                        href={nextMilestone.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full md:w-auto px-8 py-3 bg-foreground text-background rounded-xl font-bold hover:shadow-xl transition-all text-center"
                                    >
                                        START LEARNING
                                    </a>
                                </div>
                            </div>
                        </section>
                    )}
                </>
            ) : (
                <>
                    {/* Beginner Welcome Message */}
                    <div className="mb-12 p-8 rounded-2xl border border-border bg-card">
                        <h2 className="text-2xl font-bold mb-4">Welcome to Your Learning Journey</h2>
                        <p className="text-muted-foreground mb-4">
                            We've curated personalized recommendations to help you build a strong foundation.
                            Start with the fundamentals and work your way up.
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-muted-foreground">AI-powered recommendations based on your learning path</span>
                        </div>
                    </div>
                </>
            )}

            {/* Recommendations Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold italic uppercase tracking-wider">
                        {showProgressReport ? "Recommended Resources" : "Your Learning Path"}
                    </h2>
                    <span className="text-xs text-muted-foreground">Updated daily</span>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    {recommendations.length > 0 ? (
                        recommendations.map((rec) => (
                            <RecommendationCard key={rec.id} recommendation={rec} />
                        ))
                    ) : (
                        <div className="col-span-2 p-12 rounded-2xl border border-dashed border-border bg-muted/30 text-center">
                            <p className="text-muted-foreground mb-4">No recommendations yet. Let's generate some for you!</p>
                            <form action="/api/generate-recommendations" method="POST">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-foreground text-background rounded-xl font-bold hover:opacity-90 transition-opacity"
                                >
                                    Generate Recommendations
                                </button>
                            </form>
                        </div>
                    )}
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
