import { prisma } from "@/lib/prisma";

export async function getDashboardData(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return {
      user: null,
      progress: [],
      recommendations: [],
      topTopics: [],
      weakTopics: [],
      nextMilestone: null,
      stats: {
        readinessScore: 0,
        streak: 0,
        consistency: 0,
        activeTrack: null,
      },
    };
  }

  const progress = await prisma.userTopicProgress.findMany({
    where: { userId },
    include: { topic: true },
    orderBy: { score: "desc" },
    take: 10,
  });

  const recommendations = await prisma.recommendation.findMany({
    where: {
      userId,
      completed: false,
    },
    orderBy: { relevanceScore: "desc" },
    take: 10,
  });

  const sortedProgress = Array.isArray(progress) ? [...progress] : [];
  sortedProgress.sort((a, b) => (b.score || 0) - (a.score || 0));

  const topTopics = sortedProgress.slice(0, 3).map((p) => p.topic.name);

  const readinessScore =
    sortedProgress.length > 0
      ? Math.round(
          sortedProgress.reduce((sum, p) => sum + (p.score || 0), 0) /
            sortedProgress.length
        )
      : 0;

  let weakTopics = [];
  if (sortedProgress.length > 0) {
    const lowScoreTopics = [...sortedProgress]
      .sort((a, b) => (a.score || 0) - (b.score || 0))
      .filter((p) => (p.score || 0) < 70)
      .slice(0, 3)
      .map((p) => ({
        name: p.topic.name,
        score: p.score,
      }));
    weakTopics = lowScoreTopics;
  }

  const totalAttempts = progress?.reduce((sum, p) => sum + p.attempts, 0) || 0;
  const daysActive = Math.max(user.streak, 1);
  const consistency = Math.min(Math.round((totalAttempts / daysActive) * 20), 100);

  let nextMilestone = null;
  if (recommendations && recommendations.length > 0) {
    const topRec = recommendations[0];
    nextMilestone = {
      title: topRec.title,
      description: topRec.description,
      url: topRec.url,
      type: topRec.type,
      source: topRec.source,
      difficulty: topRec.difficulty,
    };
  }

  return {
    user,
    progress: progress || [],
    recommendations: recommendations || [],
    topTopics,
    weakTopics,
    nextMilestone,
    stats: {
      readinessScore,
      streak: user.streak,
      consistency,
      activeTrack: user.activeTrack,
    },
  };
}

export async function generateRecommendations() {
  return { success: true };
}
