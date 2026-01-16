import { Navbar } from "@/components/navbar";

export default function TracksPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
            <Navbar />
            <main className="pt-32 px-6 max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-6">Learning Tracks</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-12">
                    Select a specialized path to mastery.
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Placeholder content */}
                    <div className="p-6 rounded-xl border border-dashed border-gray-300 dark:border-neutral-700 flex items-center justify-center h-48 bg-gray-50 dark:bg-neutral-900">
                        <p className="font-medium text-gray-400">Full Stack Engineering (Coming Soon)</p>
                    </div>
                    <div className="p-6 rounded-xl border border-dashed border-gray-300 dark:border-neutral-700 flex items-center justify-center h-48 bg-gray-50 dark:bg-neutral-900">
                        <p className="font-medium text-gray-400">AI & LLMs (Coming Soon)</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
