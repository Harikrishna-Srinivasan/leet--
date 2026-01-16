import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const topics = await prisma.topic.findMany({
            orderBy: { difficulty: "asc" },
        });

        const progress = await prisma.userTopicProgress.findMany({
            where: { userId: user.id },
            include: { topic: true },
            orderBy: { score: "asc" },
        });

        let topicsToFocus = [];

        if (progress.length > 0) {
            const weakProgress = progress
                .filter((p) => (p.score || 0) < 70)
                .slice(0, 5);

            if (weakProgress.length > 0) {
                topicsToFocus = weakProgress
                    .map((p) => p.topic)
                    .filter((t) => !!t);
            }
        }

        if (topicsToFocus.length === 0) {
            const readinessScore =
                progress.length > 0
                    ? Math.round(
                        progress.reduce((sum, p) => sum + (p.score || 0), 0) /
                        progress.length
                    )
                    : 0;

            topicsToFocus =
                readinessScore < 30 ? topics.slice(0, 5) : topics.slice(0, 3);
        }

        const recommendationsPayload = [];

        for (const topic of topicsToFocus) {
            if (topic.category === "Programming Languages") {
                recommendationsPayload.push(
                    {
                        title: `${topic.name} - Interactive Tutorial`,
                        description: `Master ${topic.name} through interactive exercises and challenges`,
                        url: getLanguageUrl(topic.name),
                        type: "tutorial",
                        source: "github",
                        difficulty: topic.difficulty,
                        topicId: topic.id,
                        relevanceScore: 0.9,
                    },
                    {
                        title: `${topic.name} - Problem Set`,
                        description: `Practice ${topic.name} with curated coding problems`,
                        url: getLeetCodeUrl(topic.name),
                        type: "problem",
                        source: "leetcode",
                        difficulty: topic.difficulty,
                        topicId: topic.id,
                        relevanceScore: 0.85,
                    }
                );
            } else if (topic.category === "Data Structures") {
                recommendationsPayload.push(
                    {
                        title: `${topic.name} - Visualizer`,
                        description: `Visualize and understand ${topic.name} operations step by step`,
                        url: getVisualizerUrl(topic.name),
                        type: "tutorial",
                        source: "github",
                        difficulty: topic.difficulty,
                        topicId: topic.id,
                        relevanceScore: 0.9,
                    },
                    {
                        title: `${topic.name} - Practice Problems`,
                        description: `Solve ${topic.name} problems on LeetCode`,
                        url: getLeetCodeDSUrl(topic.name),
                        type: "problem",
                        source: "leetcode",
                        difficulty: topic.difficulty,
                        topicId: topic.id,
                        relevanceScore: 0.88,
                    }
                );
            } else if (topic.category === "Databases") {
                recommendationsPayload.push(
                    {
                        title: `${topic.name} - Complete Course`,
                        description: `Comprehensive guide to ${topic.name}`,
                        url: getDatabaseUrl(topic.name),
                        type: "tutorial",
                        source: "youtube",
                        difficulty: topic.difficulty,
                        topicId: topic.id,
                        relevanceScore: 0.87,
                    }
                );
            } else if (topic.category === "Machine Learning") {
                recommendationsPayload.push(
                    {
                        title: `${topic.name} - Kaggle Competition`,
                        description: `Apply ${topic.name} concepts in real-world competitions`,
                        url: "https://www.kaggle.com/competitions",
                        type: "competition",
                        source: "kaggle",
                        difficulty: topic.difficulty,
                        topicId: topic.id,
                        relevanceScore: 0.85,
                    },
                    {
                        title: `${topic.name} - Research Papers`,
                        description: `Latest ${topic.name} research and implementations`,
                        url: "https://huggingface.co/papers",
                        type: "article",
                        source: "huggingface",
                        difficulty: topic.difficulty,
                        topicId: topic.id,
                        relevanceScore: 0.82,
                    },
                    {
                        title: `${topic.name} - Curated Datasets`,
                        description: `Explore high-quality datasets to deepen your ${topic.name} skills`,
                        url: "https://www.kaggle.com/datasets",
                        type: "dataset",
                        source: "kaggle",
                        difficulty: topic.difficulty,
                        topicId: topic.id,
                        relevanceScore: 0.83,
                    }
                );
            } else if (topic.category === "DevOps") {
                recommendationsPayload.push(
                    {
                        title: `${topic.name} - Hands-on Tutorial`,
                        description: `Learn ${topic.name} with practical examples`,
                        url: getDevOpsUrl(topic.name),
                        type: "tutorial",
                        source: "github",
                        difficulty: topic.difficulty,
                        topicId: topic.id,
                        relevanceScore: 0.86,
                    }
                );
            }
        }

        for (const rec of recommendationsPayload) {
            await prisma.recommendation.upsert({
                where: {
                    userId_title: {
                        userId: user.id,
                        title: rec.title,
                    },
                },
                create: {
                    userId: user.id,
                    title: rec.title,
                    description: rec.description,
                    url: rec.url,
                    type: rec.type,
                    source: rec.source,
                    difficulty: rec.difficulty,
                    topicId: rec.topicId,
                    relevanceScore: rec.relevanceScore,
                },
                update: {
                    description: rec.description,
                    url: rec.url,
                    difficulty: rec.difficulty,
                    topicId: rec.topicId,
                    relevanceScore: rec.relevanceScore,
                    completed: false,
                },
            });
        }

        return NextResponse.redirect(new URL("/dashboard", req.url));
    } catch (error) {
        console.error("Error generating recommendations:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function getLanguageUrl(language) {
    const urls = {
        "C Fundamentals": "https://github.com/learn-c-org/learn-c-org.github.io",
        "C++ Fundamentals": "https://github.com/isocpp/CppCoreGuidelines",
        "Python Fundamentals": "https://github.com/Asabeneh/30-Days-Of-Python",
        "JavaScript Fundamentals": "https://github.com/javascript-tutorial/en.javascript.info",
    };
    return urls[language] || "https://github.com/topics/programming-languages";
}

function getLeetCodeUrl() {
    return "https://leetcode.com/problemset/";
}

function getVisualizerUrl() {
    return "https://visualgo.net/en";
}

function getLeetCodeDSUrl(topic) {
    const topicMap = {
        "Arrays & Strings": "array",
        "Linked Lists": "linked-list",
        "Stacks & Queues": "stack",
        "Trees & Binary Trees": "tree",
        "Graphs": "graph",
        "Heaps & Priority Queues": "heap",
        "Hash Tables": "hash-table",
    };
    const tag = topicMap[topic] || "all";
    return `https://leetcode.com/tag/${tag}/`;
}

function getDatabaseUrl(database) {
    const urls = {
        "SQL Fundamentals": "https://www.youtube.com/watch?v=HXV3zeQKqGY",
        PostgreSQL: "https://www.youtube.com/watch?v=qw--VYLpxG4",
        MongoDB: "https://www.youtube.com/watch?v=c2M-rlkkT5o",
        MySQL: "https://www.youtube.com/watch?v=7S_tz1z_5bA",
    };
    return urls[database] || "https://www.youtube.com/results?search_query=database+tutorial";
}

function getDevOpsUrl(topic) {
    const urls = {
        "Docker Fundamentals": "https://github.com/docker/getting-started",
        "Kubernetes Basics": "https://github.com/kubernetes/examples",
        "CI/CD Pipelines": "https://github.com/actions/starter-workflows",
    };
    return urls[topic] || "https://github.com/topics/devops";
}
