import { GoogleGenAI, Type } from "@google/genai";
import { Project, AIAnalysisResult } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // In a real enterprise app, this would log to a monitoring service
    console.warn("API_KEY is not set in process.env. AI features will not work.");
  }
  // Return a new instance for each call to ensure latest config/key is used.
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const analyzeProjectRisks = async (project: Project): Promise<AIAnalysisResult> => {
  const ai = getAiClient();
  const model = "gemini-2.5-flash";

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
      startDate: t.startDate,
      endDate: t.endDate
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

    const textResponse = response.text;
    if (textResponse) {
      // Safely parse JSON
      return JSON.parse(textResponse) as AIAnalysisResult;
    }
    
    console.warn("AI analysis returned an empty response.");
    return {
      summary: "AI analysis could not be completed at this time.",
      risks: ["No response from the analysis engine."],
      recommendations: ["Please try again later."]
    };

  } catch (error: unknown) {
    console.error("Error analyzing project:", error);
    let errorMessage = "An unknown error occurred during analysis.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return {
      summary: "Could not generate analysis due to a system error.",
      risks: [`Error: ${errorMessage}`],
      recommendations: ["Check the application logs and API configuration."]
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

   try {
     const chat = ai.chats.create({
       model,
       config: { systemInstruction }
     });
     
     const result = await chat.sendMessage({ message: userMessage });
     return result.text || "I couldn't process that request at the moment. Please try again.";
   } catch (error: unknown) {
     console.error("Error in chatWithProjectData:", error);
     if (error instanceof Error) {
         return `Sorry, an error occurred: ${error.message}`;
     }
     return "Sorry, an unknown error occurred while processing your request.";
   }
};

export const generatePortfolioReport = async (projects: Project[]): Promise<string> => {
  const ai = getAiClient();
  const model = "gemini-3-pro-preview";

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

    return response.text || "Failed to generate portfolio report: empty response from model.";

  } catch (error: unknown) {
    console.error("Error generating portfolio report:", error);
    if (error instanceof Error) {
        return `An error occurred while generating the portfolio report: ${error.message}`;
    }
    return "An unknown error occurred while generating the portfolio report.";
  }
};