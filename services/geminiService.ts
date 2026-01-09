
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Project, AIAnalysisResult, Program } from '../types/index';

const getAiClient = () => {
  // Create a new GoogleGenAI instance on each call to ensure the latest API key from process.env is used.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeProjectRisks = async (project: Project): Promise<AIAnalysisResult> => {
  const ai = getAiClient();
  const model = "gemini-3-pro-preview";

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
      return JSON.parse(textResponse) as AIAnalysisResult;
    }
    
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

export const generateWBS = async (projectName: string, description: string): Promise<any[]> => {
  const ai = getAiClient();
  const model = "gemini-3-pro-preview";

  const prompt = `
    Generate a Work Breakdown Structure (WBS) for a project named "${projectName}".
    Context: ${description}.
    Return a flat array of WBS nodes. The root node should be level 1.
    Include 3-5 high level phases (Level 2) and 2-3 deliverables under each (Level 3).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              wbsCode: { type: Type.STRING }
            }
          }
        }
      }
    });
    
    const text = response.text;
    if (text) return JSON.parse(text);
    return [];
  } catch (error) {
    console.error("Error generating WBS:", error);
    return [];
  }
};

export const suggestRisks = async (projectDescription: string, category: string): Promise<any[]> => {
    const ai = getAiClient();
    const model = "gemini-3-pro-preview";
    
    const prompt = `
        Identify 3 potential risks for a project described as: "${projectDescription}".
        Focus on the category: "${category}".
        Return structured data for a Risk Register.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: { type: Type.STRING },
                            probability: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                            impact: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                            mitigationPlan: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        const text = response.text;
        if (text) return JSON.parse(text);
        return [];
    } catch (error) {
        console.error("Error generating risks:", error);
        return [];
    }
};

export const generatePortfolioOptimization = async (projects: Project[], budgetLimit: number): Promise<string> => {
    const ai = getAiClient();
    const model = 'gemini-3-pro-preview';

    const prompt = `
        You are a Strategic Portfolio Advisor for Nexus PPM. Analyze the following project candidates and a budget constraint of $${budgetLimit}.
        Suggest the optimal set of projects to fund to maximize Strategic Importance and Financial Value while minimizing Risk Score.
        
        Candidates:
        ${JSON.stringify(projects.map(p => ({
            id: p.id,
            name: p.name,
            budget: p.budget,
            stratImportance: p.strategicImportance,
            finValue: p.financialValue,
            riskScore: p.riskScore
        })))}

        Provide your recommendation in markdown format. Explain the "Efficient Frontier" rationale for your choices.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text ?? "No recommendation generated.";
    } catch (error) {
        console.error("Portfolio AI optimization failed:", error);
        return "Failed to analyze portfolio strategy.";
    }
};

let chat: Chat | null = null;
let lastProjectId: string | null = null;

export const chatWithProjectData = async (project: Project, userMessage: string): Promise<string> => {
   const ai = getAiClient();
   const model = "gemini-3-flash-preview";
   const systemInstruction = `
     You are Nexus AI, an assistant for the Nexus PPM platform. 
     You have access to the current project context: "${project.name}".
     Project Details: ${JSON.stringify(project)}.
     Answer questions about schedule, budget, and resources concisely.
   `;
   try {
     if (!chat || lastProjectId !== project.id) {
       chat = ai.chats.create({
         model,
         config: { systemInstruction }
       });
       lastProjectId = project.id;
     }

     const result = await chat.sendMessage({ message: userMessage });
     return result.text ?? "I couldn't process that request at the moment.";
   } catch (error: unknown) {
     console.error("Error in chatWithProjectData:", error);
     return "Sorry, an error occurred while processing your request.";
   }
};

export const generatePortfolioReport = async (projects: Project[]): Promise<string> => {
  const ai = getAiClient();
  const model = 'gemini-3-pro-preview';
  const prompt = `
    You are an expert Portfolio Analyst for Nexus PPM. Generate an executive summary for these projects:
    ${JSON.stringify(projects.map(p => ({ id: p.id, name: p.name, health: p.health, budget: p.budget, spent: p.spent })))}
    Focus on portfolio health, major risks, and strategic recommendations.
  `;
  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text ?? "Empty report.";
  } catch (error) {
    console.error("Error generating portfolio report:", error);
    return "Error generating portfolio report.";
  }
};

export const generateProgramReport = async (program: Program, projects: Project[]): Promise<string> => {
  const ai = getAiClient();
  const model = 'gemini-3-pro-preview';
  const prompt = `
    You are an expert Program Manager for Nexus PPM. Generate an executive status report for the following program:
    Program: ${program.name}
    Health: ${program.health}
    Budget: ${program.budget}
    Description: ${program.description}

    Child Projects:
    ${JSON.stringify(projects.map(p => ({ name: p.name, health: p.health, progress: p.tasks.length > 0 ? 'Active' : 'Planned' })))}

    Focus on program-level risks, inter-project dependencies, and benefits realization.
    Provide the output in Markdown format.
  `;
  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text ?? "Empty report.";
  } catch (error) {
    console.error("Error generating program report:", error);
    return "Error generating program report.";
  }
};
