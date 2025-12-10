import { GoogleGenAI, Type } from "@google/genai";
import { Project, AIAnalysisResult } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set in process.env");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const analyzeProjectRisks = async (project: Project): Promise<AIAnalysisResult> => {
  const ai = getAiClient();
  const model = "gemini-2.5-flash"; // Using fast model for quick UI feedback

  const prompt = `
    You are an expert Project Management Consultant similar to a master scheduler using Oracle P6.
    Analyze the following project data and provide a JSON response with a summary, potential risks (especially looking at critical path and delayed tasks), and recommendations.
    
    Project Name: ${project.name}
    Budget: $${project.budget}
    Spent: $${project.spent}
    Current Health: ${project.health}
    Tasks:
    ${JSON.stringify(project.tasks.map(t => ({
      name: t.name,
      status: t.status,
      progress: t.progress,
      critical: t.critical,
      assigned: t.assignments
    })))}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            risks: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    // FIX: An empty response from the AI was throwing an error. Now, it returns a default object.
    return {
      summary: "Could not generate analysis at this time.",
      risks: ["System error during analysis."],
      recommendations: ["Check API configuration."]
    };

  } catch (error) {
    console.error("Error analyzing project:", error);
    return {
      summary: "Could not generate analysis at this time.",
      risks: ["System error during analysis."],
      recommendations: ["Check API configuration."]
    };
  }
};

export const chatWithProjectData = async (project: Project, userMessage: string, history: string[]): Promise<string> => {
   const ai = getAiClient();
   const model = "gemini-2.5-flash";

   const systemInstruction = `
     You are Nexus AI, an assistant for the Nexus PPM platform. 
     You have access to the current project context: "${project.name}".
     Project Details: ${JSON.stringify(project)}.
     Answer questions about schedule, budget, and resources concisely.
   `;

   // Construct history for context (simplified)
   // In a real app, use proper ChatSession history
   const chat = ai.chats.create({
     model,
     config: { systemInstruction }
   });

   // Simulate history injection by sending previous turns if needed, or just relying on system instruction for context in this stateless turn
   // For this scaffold, we will just send the message directly to a fresh chat initialized with system context.
   
   const result = await chat.sendMessage({ message: userMessage });
   return result.text || "I couldn't process that request.";
};

export const generatePortfolioReport = async (projects: Project[]): Promise<string> => {
  const ai = getAiClient();
  const model = "gemini-3-pro-preview"; // Using a more capable model for comprehensive reports

  const prompt = `
    You are an expert Portfolio Analyst for Nexus PPM. Your task is to generate a comprehensive executive summary report for the following portfolio of projects.
    Focus on overall health, key risks, budget performance, and strategic recommendations across the entire portfolio.
    
    Projects in Portfolio:
    ${JSON.stringify(projects.map(p => ({
      id: p.id,
      name: p.name,
      code: p.code,
      health: p.health,
      manager: p.manager,
      budget: p.budget,
      spent: p.spent,
      startDate: p.startDate,
      endDate: p.endDate,
      totalTasks: p.tasks.length,
      completedTasks: p.tasks.filter(t => t.status === 'Completed').length,
      delayedTasks: p.tasks.filter(t => t.status === 'Delayed').length
    })))}

    Provide a concise, professional executive summary that includes:
    1. Overall Portfolio Health Assessment.
    2. Key Strengths and areas performing well.
    3. Major Risks and Challenges identified across the portfolio.
    4. Strategic Recommendations for improving portfolio performance and mitigating risks.
    Format your response as markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.7,
        topK: 64,
        topP: 0.95,
      },
    });

    return response.text || "Failed to generate portfolio report.";

  } catch (error) {
    console.error("Error generating portfolio report:", error);
    // FIX: The type of 'error' is 'unknown'. Cast it to 'any' to access the 'message' property.
    return `An error occurred while generating the portfolio report: ${(error as any).message}`;
  }
};