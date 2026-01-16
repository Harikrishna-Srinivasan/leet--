/*
  # Complete Database Schema for Leet++

  ## Overview
  This migration creates the complete database schema including authentication tables
  (NextAuth/Prisma adapter compatible) and user progress tracking system.

  ## Tables Created
  
  ### Authentication Tables (NextAuth Compatible)
  
  #### `User`
  User account information
  - `id` (text, primary key) - User identifier (cuid)
  - `email` (text, unique, nullable) - User email address
  - `emailVerified` (timestamptz, nullable) - Email verification timestamp
  - `name` (text, nullable) - User display name
  - `image` (text, nullable) - User profile image URL
  - `readinessScore` (integer) - Overall learning readiness score (0-100)
  - `streak` (integer) - Current learning streak in days
  - `activeTrack` (text, nullable) - Current active learning track
  - `weakTopics` (jsonb) - Array of topics user needs to improve
  - `lastScoreUpdate` (timestamptz) - Last time readiness score was updated

  #### `Account`
  OAuth provider accounts linked to users
  - `id` (text, primary key) - Account identifier (cuid)
  - `userId` (text, foreign key) - Reference to User
  - `type` (text) - Account type
  - `provider` (text) - OAuth provider name (github, google)
  - `providerAccountId` (text) - Provider's user ID
  - `refresh_token` (text, nullable) - OAuth refresh token
  - `access_token` (text, nullable) - OAuth access token
  - `expires_at` (integer, nullable) - Token expiration timestamp
  - `token_type` (text, nullable) - Token type
  - `scope` (text, nullable) - OAuth scopes
  - `id_token` (text, nullable) - OpenID Connect ID token
  - `session_state` (text, nullable) - OAuth session state

  ### Learning System Tables
  
  #### `topics`
  Learning topics and subjects
  - `id` (uuid, primary key) - Topic identifier
  - `name` (text) - Topic name
  - `category` (text) - Category (e.g., "Data Structures", "Programming Language")
  - `difficulty` (text) - Difficulty level (beginner, intermediate, advanced)
  - `prerequisites` (jsonb) - Array of prerequisite topic IDs
  - `description` (text) - Topic description
  - `created_at` (timestamptz) - Creation timestamp

  #### `user_topic_progress`
  User progress on individual topics
  - `id` (uuid, primary key) - Progress record identifier
  - `user_id` (text, foreign key) - Reference to User
  - `topic_id` (uuid, foreign key) - Reference to topics
  - `score` (integer) - Score on this topic (0-100)
  - `completed_at` (timestamptz, nullable) - Completion timestamp
  - `last_practiced` (timestamptz) - Last practice timestamp
  - `attempts` (integer) - Number of practice attempts
  - `created_at` (timestamptz) - Creation timestamp

  #### `recommendations`
  Personalized learning recommendations
  - `id` (uuid, primary key) - Recommendation identifier
  - `user_id` (text, foreign key) - Reference to User
  - `title` (text) - Recommendation title
  - `description` (text) - Resource description
  - `url` (text) - Resource link
  - `type` (text) - Type (problem, video, article, competition, dataset, tutorial)
  - `source` (text) - Platform (leetcode, kaggle, youtube, huggingface, github)
  - `difficulty` (text) - Difficulty level
  - `topic_id` (uuid, foreign key, nullable) - Related topic
  - `relevance_score` (decimal) - AI-calculated relevance (0-1)
  - `completed` (boolean) - Completion status
  - `created_at` (timestamptz) - Creation timestamp
  - `expires_at` (timestamptz) - Expiration timestamp

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Topics are readable by all authenticated users
  
  ## Indexes
  - Foreign key indexes for performance
  - Unique constraints to prevent duplicates

  ## Notes
  - auth.uid() returns UUID but User.id is text (cuid), so we cast using ::text
  - This schema is compatible with NextAuth v5 and Prisma adapter
*/

-- Create User table (NextAuth compatible)
CREATE TABLE IF NOT EXISTS "User" (
  id text PRIMARY KEY,
  email text UNIQUE,
  "emailVerified" timestamptz,
  name text,
  image text,
  "readinessScore" integer DEFAULT 0,
  streak integer DEFAULT 0,
  "activeTrack" text,
  "weakTopics" jsonb DEFAULT '[]'::jsonb,
  "lastScoreUpdate" timestamptz DEFAULT now()
);

-- Create Account table (NextAuth compatible)
CREATE TABLE IF NOT EXISTS "Account" (
  id text PRIMARY KEY,
  "userId" text NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  type text NOT NULL,
  provider text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at integer,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  UNIQUE(provider, "providerAccountId")
);

-- Create index on Account userId
CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account"("userId");

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL DEFAULT 'beginner',
  prerequisites jsonb DEFAULT '[]'::jsonb,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create user_topic_progress table
CREATE TABLE IF NOT EXISTS user_topic_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  score integer DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  completed_at timestamptz,
  last_practiced timestamptz DEFAULT now(),
  attempts integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  url text NOT NULL,
  type text NOT NULL,
  source text NOT NULL,
  difficulty text DEFAULT 'beginner',
  topic_id uuid REFERENCES topics(id) ON DELETE SET NULL,
  relevance_score decimal(3,2) DEFAULT 0.5 CHECK (relevance_score >= 0 AND relevance_score <= 1),
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '30 days')
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_user_id ON user_topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_topic_id ON user_topic_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_topic_id ON recommendations(topic_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_expires_at ON recommendations(expires_at);

-- Enable Row Level Security
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for User table
CREATE POLICY "Users can view own profile"
  ON "User" FOR SELECT
  TO authenticated
  USING (id = auth.uid()::text);

CREATE POLICY "Users can update own profile"
  ON "User" FOR UPDATE
  TO authenticated
  USING (id = auth.uid()::text)
  WITH CHECK (id = auth.uid()::text);

-- RLS Policies for Account table
CREATE POLICY "Users can view own accounts"
  ON "Account" FOR SELECT
  TO authenticated
  USING ("userId" = auth.uid()::text);

CREATE POLICY "Users can insert own accounts"
  ON "Account" FOR INSERT
  TO authenticated
  WITH CHECK ("userId" = auth.uid()::text);

CREATE POLICY "Users can update own accounts"
  ON "Account" FOR UPDATE
  TO authenticated
  USING ("userId" = auth.uid()::text)
  WITH CHECK ("userId" = auth.uid()::text);

CREATE POLICY "Users can delete own accounts"
  ON "Account" FOR DELETE
  TO authenticated
  USING ("userId" = auth.uid()::text);

-- RLS Policies for topics (all authenticated users can read)
CREATE POLICY "Authenticated users can view all topics"
  ON topics FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_topic_progress
CREATE POLICY "Users can view own progress"
  ON user_topic_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own progress"
  ON user_topic_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own progress"
  ON user_topic_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

-- RLS Policies for recommendations
CREATE POLICY "Users can view own recommendations"
  ON recommendations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own recommendations"
  ON recommendations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own recommendations"
  ON recommendations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can delete own recommendations"
  ON recommendations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid()::text);

-- Seed initial topics
INSERT INTO topics (name, category, difficulty, description, prerequisites) VALUES
  -- Programming Languages - Fundamentals
  ('C Fundamentals', 'Programming Languages', 'beginner', 'Master the basics of C programming including pointers and memory management', '[]'),
  ('C++ Fundamentals', 'Programming Languages', 'beginner', 'Learn C++ syntax, OOP concepts, and STL', '[]'),
  ('Python Fundamentals', 'Programming Languages', 'beginner', 'Python syntax, data structures, and basic programming concepts', '[]'),
  ('JavaScript Fundamentals', 'Programming Languages', 'beginner', 'JavaScript basics, ES6+ features, and async programming', '[]'),
  
  -- Data Structures
  ('Arrays & Strings', 'Data Structures', 'beginner', 'Understanding arrays, strings, and basic operations', '[]'),
  ('Linked Lists', 'Data Structures', 'beginner', 'Single, double, and circular linked lists', '[]'),
  ('Stacks & Queues', 'Data Structures', 'beginner', 'LIFO and FIFO data structures and their applications', '[]'),
  ('Trees & Binary Trees', 'Data Structures', 'intermediate', 'Binary trees, BST, and tree traversals', '[]'),
  ('Graphs', 'Data Structures', 'intermediate', 'Graph representations, BFS, DFS, and algorithms', '[]'),
  ('Heaps & Priority Queues', 'Data Structures', 'intermediate', 'Min/Max heaps and priority queue operations', '[]'),
  ('Hash Tables', 'Data Structures', 'intermediate', 'Hash functions, collision resolution, and applications', '[]'),
  
  -- Algorithms
  ('Sorting Algorithms', 'Algorithms', 'beginner', 'QuickSort, MergeSort, HeapSort and their complexities', '[]'),
  ('Searching Algorithms', 'Algorithms', 'beginner', 'Binary search, linear search, and variants', '[]'),
  ('Dynamic Programming', 'Algorithms', 'advanced', 'Memoization, tabulation, and classic DP problems', '[]'),
  ('Greedy Algorithms', 'Algorithms', 'intermediate', 'Greedy choice property and optimal substructure', '[]'),
  
  -- Databases
  ('SQL Fundamentals', 'Databases', 'beginner', 'SQL syntax, queries, and basic database concepts', '[]'),
  ('PostgreSQL', 'Databases', 'intermediate', 'Advanced PostgreSQL features and optimization', '[]'),
  ('MongoDB', 'Databases', 'intermediate', 'NoSQL database design and MongoDB operations', '[]'),
  ('MySQL', 'Databases', 'intermediate', 'MySQL features, optimization, and best practices', '[]'),
  
  -- Tools & Version Control
  ('Git Basics', 'Tools', 'beginner', 'Version control fundamentals and Git commands', '[]'),
  ('GitHub Workflow', 'Tools', 'beginner', 'Pull requests, issues, and collaboration on GitHub', '[]'),
  
  -- Web Frameworks
  ('React Fundamentals', 'Web Frameworks', 'intermediate', 'Components, hooks, and state management in React', '[]'),
  ('Node.js Basics', 'Web Frameworks', 'intermediate', 'Server-side JavaScript and Express.js', '[]'),
  ('Next.js', 'Web Frameworks', 'intermediate', 'Server-side rendering and static site generation', '[]'),
  
  -- DevOps & Cloud
  ('Docker Fundamentals', 'DevOps', 'intermediate', 'Containerization and Docker basics', '[]'),
  ('Kubernetes Basics', 'DevOps', 'advanced', 'Container orchestration and K8s fundamentals', '[]'),
  ('CI/CD Pipelines', 'DevOps', 'intermediate', 'Continuous integration and deployment practices', '[]'),
  
  -- Machine Learning & AI
  ('Machine Learning Basics', 'Machine Learning', 'intermediate', 'Supervised and unsupervised learning fundamentals', '[]'),
  ('Deep Learning', 'Machine Learning', 'advanced', 'Neural networks, CNN, RNN, and training techniques', '[]'),
  ('Natural Language Processing', 'Machine Learning', 'advanced', 'Text processing, transformers, and language models', '[]'),
  ('AI Agents', 'Machine Learning', 'advanced', 'Building intelligent agents and LLM applications', '[]'),
  ('MLOps', 'Machine Learning', 'advanced', 'ML model deployment, monitoring, and maintenance', '[]')
ON CONFLICT DO NOTHING;
