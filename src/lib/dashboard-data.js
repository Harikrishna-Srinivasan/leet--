import { createClient } from '@supabase/supabase-js';

export async function getDashboardData(userId) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: user, error: userError } = await supabase
    .from('User')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (userError || !user) {
    return {
      user: null,
      progress: [],
      recommendations: [],
      topTopics: [],
      stats: {
        readinessScore: 0,
        streak: 0,
        consistency: 0,
        activeTrack: null,
      },
    };
  }

  const { data: progress, error: progressError } = await supabase
    .from('user_topic_progress')
    .select('*, topics(*)')
    .eq('user_id', userId)
    .order('score', { ascending: false })
    .limit(10);

  const { data: recommendations, error: recsError } = await supabase
    .from('recommendations')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', false)
    .gt('expires_at', new Date().toISOString())
    .order('relevance_score', { ascending: false })
    .limit(10);

  const topTopics = progress?.slice(0, 3).map((p) => p.topics.name) || [];

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
    nextMilestone,
    stats: {
      readinessScore: user.readinessScore,
      streak: user.streak,
      consistency,
      activeTrack: user.activeTrack,
    },
  };
}

export async function generateRecommendations(userId, authToken) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-recommendations`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to generate recommendations');
  }

  return await response.json();
}
