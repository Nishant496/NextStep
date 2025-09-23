import { GoogleGenerativeAI } from "@google/generative-ai";

// Use import.meta.env instead of process.env for Vite
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Check API key exists before initializing
if (!API_KEY) {
  console.error('Gemini API key is missing. Please check your .env file contains VITE_GEMINI_API_KEY');
}

// Initialize Gemini AI - using Vite environment variables
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
});

// Store conversation history for context
let conversationHistory = [];

export const generateRoadmapContent = async (prompt) => {
  try {
    // Check if API key exists
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured. Please check your .env file.');
    }

    const systemPrompt = `You are a helpful assistant for the NextStep website.
Your only purpose is to guide users with roadmaps for skills, careers, or learning paths.

Response Rules:
1. Always give the roadmap in a WEEK-BY-WEEK plan (Week 1, Week 2, Week 3…).
2. Each week should contain clear, actionable learning goals and topics.
3. Whenever possible, provide at least one YouTube video link for that week's topic. 
   - Format: "📺 YouTube: <URL>"
4. Keep roadmaps between 8-12 weeks for comprehensive learning.
5. If the user asks something unrelated to roadmaps, reply:
   "I can only help you with roadmap-related queries. Please ask me about a learning or career roadmap."
6. Keep answers concise, structured, and beginner-friendly.
7. Include practical exercises and projects in the roadmap.
8. Use markdown formatting for better structure.

Example format:
## [Skill Name] Learning Roadmap

### Week 1: Foundation
- **Topics to cover**: Basic concepts
- **Key concepts**: Understanding fundamentals  
- **📺 YouTube**: [relevant video link]
- **Practice**: [specific exercise]

### Week 2: Building Skills
- **Next topics**: Intermediate concepts
- **Hands-on practice**: Real projects
- **📺 YouTube**: [relevant video link]
- **Project**: [small project description]`;

    // For first message, include system prompt
    const fullPrompt = conversationHistory.length === 0 
      ? `${systemPrompt}\n\nUser: ${prompt}`
      : prompt;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const responseText = response.text();

    // Update conversation history
    conversationHistory.push(
      { role: "user", content: prompt },
      { role: "assistant", content: responseText }
    );

    // Keep only last 10 exchanges to prevent context getting too long
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }

    return responseText;
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    if (error.message.includes('API key') || error.message.includes('PERMISSION_DENIED')) {
      throw new Error('Invalid or missing API key. Please check your environment configuration.');
    } else if (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else if (error.message.includes('INVALID_ARGUMENT')) {
      throw new Error('Invalid request format. Please try rephrasing your question.');
    }
    
    throw new Error('Failed to generate roadmap content');
  }
};

export const clearConversationHistory = () => {
  conversationHistory = [];
};
