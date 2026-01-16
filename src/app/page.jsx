import Link from 'next/link';
import { Navbar } from "@/components/navbar";

export default function Home() {
    return (
        <div className="min-h-screen bg-white dark:bg-black selection:bg-gray-200 dark:selection:bg-gray-800">
            <Navbar />

            <main className="pt-32 pb-16 px-6 relative overflow-hidden">
                <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]"></div>

                {/* Hero Section */}
                <section className="max-w-5xl mx-auto text-center mb-32 relative z-10 animate-fade-in-up">
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Now in Beta
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 .bg-gradient-to-b from-black via-black to-gray-500 dark:from-white dark:via-white dark:to-gray-500 bg-clip-text text-transparent leading-[1.1]">
                        Master Engineering,
                        <br />
                        Not the Grind
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12 font-light">
                        A structured learning platform designed for deep understanding.
                        <br />
                        From fundamentals to advanced systems—without the noise.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/dashboard" className="group w-full sm:w-auto px-8 py-4 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2">
                            Start Learning
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                        <Link href="/about" className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-border hover:bg-accent transition-all duration-300 font-medium">
                            Our Philosophy
                        </Link>
                    </div>
                </section>

                {/* Feature Grid */}
                <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
                    <FeatureCard
                        title="Structured Graph"
                        desc="A dependency-based learning path. No random tutorials—just clear progression from fundamentals to mastery."
                    />
                    <FeatureCard
                        title="Deep Mastery"
                        desc="Focus on conceptual understanding over algorithmic speed. Build foundations that last."
                    />
                    <FeatureCard
                        title="Unified Platform"
                        desc="One coherent system that integrates the best resources and tools when you need them."
                    />
                </section>
            </main>
        </div>
    );
}

function FeatureCard({ title, desc }) {
    return (
        <div className="group p-8 rounded-2xl bg-card border border-border hover:border-foreground/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <h3 className="font-semibold text-xl mb-3 group-hover:text-foreground transition-colors">{title}</h3>
            <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors">{desc}</p>
        </div>
    )
}
