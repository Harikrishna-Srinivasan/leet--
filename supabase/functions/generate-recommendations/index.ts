import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Topic {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  description: string;
}

interface UserProgress {
  topic_id: string;
  score: number;
  topic: Topic;
}

interface Recommendation {
  title: string;
  description: string;
  url: string;
  type: string;
  source: string;
  difficulty: string;
  topic_id: string;
  relevance_score: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: userData, error: userError } = await supabaseClient
      .from("User")
      .select("readinessScore, weakTopics, activeTrack")
      .eq("id", user.id)
      .maybeSingle();

    if (userError) {
      throw userError;
    }

    const { data: progressData, error: progressError } = await supabaseClient
      .from("user_topic_progress")
      .select("topic_id, score, topics(id, name, category, difficulty, description)")
      .eq("user_id", user.id)
      .order("score", { ascending: true })
      .limit(10);

    if (progressError) {
      throw progressError;
    }

    const { data: allTopics, error: topicsError } = await supabaseClient
      .from("topics")
      .select("*")
      .order("difficulty", { ascending: true });

    if (topicsError) {
      throw topicsError;
    }

    const recommendations: Recommendation[] = [];
    const weakTopics = userData?.weakTopics || [];
    const readinessScore = userData?.readinessScore || 0;

    const topicsToFocus = readinessScore < 30
      ? allTopics.slice(0, 5)
      : progressData?.slice(0, 3).map((p: any) => p.topics) || allTopics.slice(0, 3);

    for (const topic of topicsToFocus) {
      const topicData = topic?.topics || topic;

      if (!topicData) continue;

      if (topicData.category === "Programming Languages") {
        recommendations.push(
          {
            title: `${topicData.name} - Interactive Tutorial`,
            description: `Master ${topicData.name} through interactive exercises and challenges`,
            url: getLanguageUrl(topicData.name),
            type: "tutorial",
            source: "github",
            difficulty: topicData.difficulty,
            topic_id: topicData.id,
            relevance_score: 0.9,
          },
          {
            title: `${topicData.name} - Problem Set`,
            description: `Practice ${topicData.name} with curated coding problems`,
            url: getLeetCodeUrl(topicData.name),
            type: "problem",
            source: "leetcode",
            difficulty: topicData.difficulty,
            topic_id: topicData.id,
            relevance_score: 0.85,
          }
        );
      } else if (topicData.category === "Data Structures") {
        recommendations.push(
          {
            title: `${topicData.name} - Visualizer`,
            description: `Visualize and understand ${topicData.name} operations step by step`,
            url: getVisualizerUrl(topicData.name),
            type: "tutorial",
            source: "github",
            difficulty: topicData.difficulty,
            topic_id: topicData.id,
            relevance_score: 0.9,
          },
          {
            title: `${topicData.name} - Practice Problems`,
            description: `Solve ${topicData.name} problems on LeetCode`,
            url: getLeetCodeDSUrl(topicData.name),
            type: "problem",
            source: "leetcode",
            difficulty: topicData.difficulty,
            topic_id: topicData.id,
            relevance_score: 0.88,
          }
        );
      } else if (topicData.category === "Databases") {
        recommendations.push(
          {
            title: `${topicData.name} - Complete Course`,
            description: `Comprehensive guide to ${topicData.name}`,
            url: getDatabaseUrl(topicData.name),
            type: "tutorial",
            source: "youtube",
            difficulty: topicData.difficulty,
            topic_id: topicData.id,
            relevance_score: 0.87,
          }
        );
      } else if (topicData.category === "Machine Learning") {
        recommendations.push(
          {
            title: `${topicData.name} - Kaggle Competition`,
            description: `Apply ${topicData.name} concepts in real-world competitions`,
            url: "https://www.kaggle.com/competitions",
            type: "competition",
            source: "kaggle",
            difficulty: topicData.difficulty,
            topic_id: topicData.id,
            relevance_score: 0.85,
          },
          {
            title: `${topicData.name} - Research Papers`,
            description: `Latest ${topicData.name} research and implementations`,
            url: "https://huggingface.co/papers",
            type: "article",
            source: "huggingface",
            difficulty: topicData.difficulty,
            topic_id: topicData.id,
            relevance_score: 0.82,
          }
        );
      } else if (topicData.category === "DevOps") {
        recommendations.push(
          {
            title: `${topicData.name} - Hands-on Tutorial`,
            description: `Learn ${topicData.name} with practical examples`,
            url: getDevOpsUrl(topicData.name),
            type: "tutorial",
            source: "github",
            difficulty: topicData.difficulty,
            topic_id: topicData.id,
            relevance_score: 0.86,
          }
        );
      }
    }

    for (const rec of recommendations) {
      const { error: insertError } = await supabaseClient
        .from("recommendations")
        .upsert({
          user_id: user.id,
          ...rec,
        });

      if (insertError) {
        console.error("Error inserting recommendation:", insertError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: recommendations.length,
        recommendations,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function getLanguageUrl(language: string): string {
  const urls: Record<string, string> = {
    "C Fundamentals": "https://github.com/learn-c-org/learn-c-org.github.io",
    "C++ Fundamentals": "https://github.com/isocpp/CppCoreGuidelines",
    "Python Fundamentals": "https://github.com/Asabeneh/30-Days-Of-Python",
    "JavaScript Fundamentals": "https://github.com/javascript-tutorial/en.javascript.info",
  };
  return urls[language] || "https://github.com/topics/programming-languages";
}

function getLeetCodeUrl(language: string): string {
  return "https://leetcode.com/problemset/";
}

function getVisualizerUrl(topic: string): string {
  return "https://visualgo.net/en";
}

function getLeetCodeDSUrl(topic: string): string {
  const topicMap: Record<string, string> = {
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

function getDatabaseUrl(database: string): string {
  const urls: Record<string, string> = {
    "SQL Fundamentals": "https://www.youtube.com/watch?v=HXV3zeQKqGY",
    PostgreSQL: "https://www.youtube.com/watch?v=qw--VYLpxG4",
    MongoDB: "https://www.youtube.com/watch?v=c2M-rlkkT5o",
    MySQL: "https://www.youtube.com/watch?v=7S_tz1z_5bA",
  };
  return urls[database] || "https://www.youtube.com/results?search_query=database+tutorial";
}

function getDevOpsUrl(topic: string): string {
  const urls: Record<string, string> = {
    "Docker Fundamentals": "https://github.com/docker/getting-started",
    "Kubernetes Basics": "https://github.com/kubernetes/examples",
    "CI/CD Pipelines": "https://github.com/actions/starter-workflows",
  };
  return urls[topic] || "https://github.com/topics/devops";
}
