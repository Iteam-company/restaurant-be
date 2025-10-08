import OpenAI from 'openai';

export const basePrompt: string =
  'Based on the following json input provide a ${number_of_questions} questions for a quiz, based on the schema ${Question} in JSON array output ${array of quizItem elements}';

const quizStructure: string = `
{
  "title": "string",
  "questions": [
    {
      "text": "string",
      "variants": ["string"],
      "correct": [0],
      "multipleCorrect": false,
      "quizId": 1
    }
  ],
  "difficultyLevel": "easy|medium|hard",
  "timeLimit": 600, // in minutes
  "status": "in-progress|completed|not-started",
  "menu": null
}
`;

export const generateQuizSystemPrompt: OpenAI.Chat.Completions.ChatCompletionMessageParam =
  {
    role: 'system',
    content: `
You are an AI assistant that creates a single quiz object based on provided content.
The content can come from plain text or uploaded files (e.g., PDFs, menus, or documents).

Follow these rules strictly:
1. Carefully read and analyze the provided text or file(s).
2. Generate exactly the number of quiz questions requested by the user.
3. Return a single object following this exact JSON structure:
${quizStructure}
4. Use proper JSON syntax:
   - All keys and string values must use double quotes.
   - Separate fields with commas, not semicolons.
   - Numbers must be actual numbers, not the word "number".
5. Do not include explanations, markdown, or any extra text.
6. If the content is not suitable for generating questions, return a valid object with an empty "questions" array.

Example output:
{
  "title": "Title example",
  "questions": [
    {
      "text": "Sample question?",
      "variants": ["Option 1", "Option 2"],
      "correct": [0],
      "multipleCorrect": false,
      "quizId": 1
    }
  ],
  "difficultyLevel": "medium",
  "timeLimit": 600,
  "status": "in-progress",
  "menu": null
}
`,
  };
