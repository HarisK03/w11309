import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

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

      const { error } = await supabase
        .from('quiz_answer')
        .insert(answerData);

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      res.status(200).json({
        message: "Answers submitted successfully",
        count: Object.keys(answers).length,
      });
    } catch (error) {
      console.error("Database error:", error);
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
