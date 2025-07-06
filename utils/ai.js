// utils/ai.js
import 'dotenv/config'; // Make sure this is installed: npm install dotenv
import axios from 'axios'; // Import axios for making HTTP requests

// --- Configuration ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Verify API Key
if (!GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is not found in your .env file or is empty.");
    console.error("Please ensure you have a .env file in your project root with GEMINI_API_KEY=YOUR_ACTUAL_API_KEY");
    process.exit(1); // Exit if no API key, as AI functionality will fail
}

// Base URL for the Google Generative Language API
const BASE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models`;

// --- AI Processing Function ---
export const processTicketWithAI = async (title, description) => {
  try {
    const MODEL_TO_USE = "gemini-1.5-flash"; // Confirmed working model

    const endpoint = `${BASE_API_URL}/${MODEL_TO_USE}:generateContent?key=${GEMINI_API_KEY}`;

    // --- UPDATED PROMPT FOR MORE DETAIL ---
    const prompt = `
You are an expert support ticket analysis AI. Analyze the provided support ticket thoroughly.
Return ONLY valid JSON. Do not include any commentary or extra text outside the JSON block.

Support Ticket:
Title: ${title}
Description: ${description}

JSON Schema:
{
  "enhancedDescription": "A concise, professionally rephrased and slightly expanded version of the description, clarifying key technical points or user intent.",
  "suggestedSkills": ["List specific technical skills required to resolve this ticket (e.g., 'JavaScript', 'Database_SQL', 'Network_Troubleshooting', 'Cloud_AWS', 'API_Integration', 'Frontend_React', 'Backend_Node.js'). Focus on technologies."],
  "priority": "Determine the urgency: 'Critical' (system down, major business impact), 'High' (significant impact, urgent attention), 'Medium' (standard, non-urgent issue), 'Low' (minor issue, cosmetic, future enhancement).",
  "category": "Classify the ticket into a broad category: 'Software_Bug', 'Hardware_Issue', 'Network_Connectivity', 'Account_Management', 'Feature_Request', 'User_Error', 'Performance_Issue', 'Security_Concern', 'Integration_Problem', 'Other_Technical'.",
  "subCategory": "Provide a more granular sub-category based on the main category (e.g., if category is 'Software_Bug', subCategory could be 'Login_Module' or 'Reporting_Feature'). Use 'General' if no specific sub-category fits.",
  "complexityScore": "Rate the complexity from 1 (very simple, quick fix) to 10 (extremely complex, multi-system, deep investigation required).",
  "estimatedResolutionTime": "Estimate the time needed for resolution, e.g., '1-2 hours', '4-8 hours', '1-2 business days', '3-5 business days', '1-2 weeks'.",
  "sentiment": "Assess the user's sentiment: 'Positive', 'Neutral', 'Negative', 'Frustrated'.",
  "keywords": ["List 5-10 important keywords or phrases from the ticket that summarize the core problem and related concepts."],
  "affectedSystems": ["List specific systems, modules, or services mentioned or clearly implied as affected (e.g., 'User Authentication Service', 'Payment Gateway', 'CRM_Database', 'Reporting Microservice', 'Mobile App iOS', 'Web Portal'). Use 'N/A' if not applicable."],
  "rootCauseHypothesis": "A brief, initial hypothesis about the likely root cause of the problem, if discernible from the description.",
  "recommendedAction": "A brief, high-level recommendation for the first step or next course of action (e.g., 'Gather more logs', 'Check database connection', 'Restart service', 'Verify user permissions').",
  "similarTickets": ["List 1-3 highly relevant, previous ticket IDs or summary descriptions if the AI can infer them (use 'None found' if it cannot)."]
}
`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      // Optional: generationConfig for more control over output
      // generationConfig: {
      //   temperature: 0.7, // Adjust creativity (0.0-1.0)
      //   maxOutputTokens: 1000, // Increase max tokens if you need longer descriptions
      // },
    };

    console.log(`Sending direct API request to: ${endpoint}`);
    const response = await axios.post(endpoint, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const aiResponseText = response.data.candidates[0].content.parts[0].text;
    console.log("AI raw response (from direct API):", aiResponseText);

    // Robust JSON extraction from the AI's response
    let jsonString = aiResponseText;
    const jsonMatch = aiResponseText.match(/```json\s*([\s\S]*?)\s*```/i);
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1];
    } else {
      const firstBrace = aiResponseText.indexOf('{');
      const lastBrace = aiResponseText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonString = aiResponseText.substring(firstBrace, lastBrace + 1);
      }
    }

    try {
        return JSON.parse(jsonString);
    } catch (parseError) {
        console.error("Failed to parse AI's JSON response:", parseError);
        console.error("Attempted to parse:", jsonString);
        throw new Error("AI response was not valid JSON after extraction.");
    }

  } catch (err) {
    console.error('AI processing failed (direct API call error):', err);
    if (err.response) {
      console.error('API Error Status:', err.response.status);
      console.error('API Error Data:', err.response.data);
      if (err.response.data && err.response.data.error) {
          console.error('API Error Message:', err.response.data.error.message);
      }
    } else if (err.request) {
      console.error('No response received from API:', err.request);
    } else {
      console.error('Error setting up API request:', err.message);
    }

    // Return a default fallback response in case of any AI processing failure
    return {
      enhancedDescription: `Technical analysis needed for: ${description}`,
      suggestedSkills: ['general-support'],
      priority: 'medium',
      category: 'general',
      complexityScore: 5,
      estimatedResolutionTime: '2-3 business days',
      similarTickets: [],
      // Default values for new fields
      subCategory: 'General',
      sentiment: 'Neutral',
      keywords: [],
      affectedSystems: ['Unknown'],
      rootCauseHypothesis: 'Further investigation required.',
      recommendedAction: 'Analyze provided description.',
    };
  }
};