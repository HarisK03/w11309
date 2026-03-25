import { createClient } from '@supabase/supabase-js'

// Get and sanitize environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set or empty')
}
if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set or empty')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (e) {
  throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL: "${supabaseUrl}". Must be a valid HTTP/HTTPS URL like https://your-project.supabase.co`)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { answers } = req.body;
      console.log("Received answers:", answers);

      if (!answers || Object.keys(answers).length === 0) {
        return res.status(400).json({ error: "No answers provided" });
      }

      // Insert all answers in batch
      const answerData = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId: parseInt(questionId),
        selectedOption
      }));

      console.log("Inserting data:", answerData);

      const { error } = await supabase
        .from('quiz_answer')
        .insert(answerData);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      res.status(200).json({
        message: "Answers submitted successfully",
        count: Object.keys(answers).length,
      });
    } catch (error) {
      console.error("Caught error:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({
        error: "Database error",
        details: error.message,
        code: error.code,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `${req.method} Method Not Allowed` });
  }
}
