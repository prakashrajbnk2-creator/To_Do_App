import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface SubTask {
  text: string;
}

export const getSmartCategory = async (taskText: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Categorize this task into one of these: Personal, Work, Shopping, Health, Coding, Finance. Task: "${taskText}". Return only the category name.`,
      config: {
        temperature: 0.1,
      },
    });
    
    const category = response.text?.trim() || "Task";
    return category;
  } catch (error) {
    console.error("AI Categorization failed:", error);
    return "Task";
  }
};

export const breakDownTask = async (taskText: string): Promise<SubTask[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Decompose this task into 3-5 small, actionable steps: "${taskText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "The step description" },
            },
            required: ["text"],
          },
        },
      },
    });

    const jsonStr = response.text?.trim();
    if (jsonStr) {
      return JSON.parse(jsonStr);
    }
    return [];
  } catch (error) {
    console.error("AI Breakdown failed:", error);
    return [];
  }
};
