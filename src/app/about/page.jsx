import { Navbar } from "@/components/navbar";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
            <Navbar />
            <main className="pt-32 px-6 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Philosophy</h1>
                <div className="prose dark:prose-invert">
                    <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300">
                        We believe that engineering is not about memorizing syntax or grinding LeetCode problems blindly.
                        It is about understanding systems, trade-offs, and first principles.
                    </p>
                    <hr className="my-8 border-gray-200 dark:border-neutral-800" />
                    <h2 className="text-2xl font-semibold mt-8 mb-4">The Manifesto</h2>
                    <p className="mb-4">
                        1. <strong>Mastery over Metrics</strong>: We optimize for deep understanding, not gamified points.
                    </p>
                    <p className="mb-4">
                        2. <strong>Tooling Agnostic</strong>: Use the best tool for the job. We point you to them.
                    </p>
                    <p>
                        3. <strong>Built for Builders</strong>: The goal is to build, not just to learn.
                    </p>
                </div>
            </main>
        </div>
    );
}
