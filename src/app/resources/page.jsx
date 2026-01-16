import { ExternalResourceCard } from "@/components/external-resource-card";
import { Navbar } from "@/components/navbar";

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Navbar />
            <main className="pt-32 px-6 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">External Tooling</h1>
                <div className="grid md:grid-cols-2 gap-6">
                    <ExternalResourceCard
                        title="Advanced PyTorch Transformer"
                        description="Reference implementation of the Transformer architecture."
                        url="https://github.com/pytorch/examples"
                        type="github"
                    />
                    <ExternalResourceCard
                        title="LLM Fine-tuning Visualizer"
                        description="Interactive notebook for visualizing attention weights."
                        url="https://colab.research.google.com"
                        type="colab"
                    />
                    <ExternalResourceCard
                        title="Distributed Systems Lecture"
                        description="Deep dive into consensus algorithms (Paxos/Raft)."
                        url="https://youtube.com"
                        type="youtube"
                    />
                </div>
            </main>
        </div>
    )
}
