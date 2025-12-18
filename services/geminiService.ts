import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, DailyMetrics, MealEntry, DailyLog } from "../types";

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY'; 

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to clean JSON string from markdown code blocks
const cleanJSON = (text: string) => {
    return text.replace(/```json\n?|```/g, '').trim();
};

export const geminiService = {
  async analyzeInitialProfile(profile: UserProfile): Promise<DailyMetrics> {
    // Re-use the daily vibe logic but with empty logs for initial setup
    return this.calculateDailyVibe(profile, [], {});
  },

  async calculateDailyVibe(profile: UserProfile, meals: MealEntry[], logs: DailyLog): Promise<DailyMetrics> {
    const prompt = `
      Analyze the daily health data for this user.
      User Profile: ${JSON.stringify(profile)}
      PAY ATTENTION TO: Medical Conditions (${profile.medicalHistory}), Dietary Preferences (${profile.dietaryPref}), and Activity Level (${profile.activityLevel}).
      Today's Meals: ${JSON.stringify(meals)}
      Audio Analysis Context: ${logs.audioAnalysis || "Not provided"}
      Sleep Data: ${JSON.stringify(logs.sleepData || "Not provided")}
      Stress Data: ${JSON.stringify(logs.stressData || "Not provided")}
      Diagnostic Results: ${JSON.stringify(logs.diagnosticResult || "Not provided")}

      Based on ALL inputs, generate a consolidated Daily Vibe Health Report.
      If specific data (like sleep or stress) is missing, infer a neutral baseline or flag it in suggestions, but DO NOT fail.
      
      Output JSON schema:
      {
        "vibeScore": number (0-100, overall lifestyle score),
        "nutritionScore": number (0-100),
        "stressScore": number (0-100),
        "sleepScore": number (0-100),
        "postureScore": number (0-100),
        "activityScore": number (0-100),
        "biologicalAge": number,
        "chronologicalAge": number,
        "stressLevelTag": string (Low, Moderate, High),
        "restingHR": number (estimate based on data),
        "hrv": number (estimate based on stress/sleep),
        "energyLevel": number (0-100),
        "hydrationLevel": number (0-100),
        "suggestions": array of strings (3 items),
        "mealQualitySummary": string (short sentence),
        "activitySummary": string (short sentence),
        "sleepSummary": string (short sentence),
        "dailyHabits": array of strings (3 actionable habits)
      }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        vibeScore: { type: Type.NUMBER },
                        nutritionScore: { type: Type.NUMBER },
                        stressScore: { type: Type.NUMBER },
                        sleepScore: { type: Type.NUMBER },
                        postureScore: { type: Type.NUMBER },
                        activityScore: { type: Type.NUMBER },
                        biologicalAge: { type: Type.NUMBER },
                        chronologicalAge: { type: Type.NUMBER },
                        stressLevelTag: { type: Type.STRING },
                        restingHR: { type: Type.NUMBER },
                        hrv: { type: Type.NUMBER },
                        energyLevel: { type: Type.NUMBER },
                        hydrationLevel: { type: Type.NUMBER },
                        suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        mealQualitySummary: { type: Type.STRING },
                        activitySummary: { type: Type.STRING },
                        sleepSummary: { type: Type.STRING },
                        dailyHabits: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        const data = JSON.parse(cleanJSON(text));
        
        // Ensure array fields are initialized
        return { 
            ...data, 
            suggestions: data.suggestions || [],
            dailyHabits: data.dailyHabits || [],
            date: new Date().toISOString().split('T')[0] 
        };
    } catch (error) {
        console.error("Gemini Error:", error);
        throw error;
    }
  },

  async analyzeMeal(dishName: string): Promise<any> {
    const prompt = `Analyze the meal "${dishName}". Estimate calories, protein(g), carbs(g), fats(g) and give a health score (0-100) and a brief analysis (max 20 words). JSON format.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fats: { type: Type.NUMBER },
                score: { type: Type.NUMBER },
                analysis: { type: Type.STRING }
            }
        }
      }
    });
    return JSON.parse(cleanJSON(response.text || "{}"));
  },

  async getMealSuggestions(meals: MealEntry[]): Promise<string> {
      if (meals.length === 0) return "No meals logged yet. Log your meals to get insights.";
      
      const prompt = `Here is what the user ate today: ${JSON.stringify(meals)}. Provide a short summary of their total nutrition and 1 specific improvement suggestion (max 30 words total).`;
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
      });
      return response.text || "Keep tracking your meals!";
  },

  async getChatResponse(history: {role: string, parts: string}[], message: string, userLocation?: {lat: number, lng: number} | null): Promise<string> {
    // We use generateContent to maintain full control over the history and grounding tools
    // Construct the full history content
    const contents = history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.parts }]
    }));
    
    // Append the new message
    contents.push({
        role: 'user',
        parts: [{ text: message }]
    });

    const systemInstruction = `You are Vibe AI, a compassionate health and wellness assistant. 
    If the user mentions stress, depression, or anxiety, offer calming techniques. 
    If they seem severely distressed, suggest professional help. 
    If the user asks for doctors, therapists, or specialists, use the googleMaps tool to find them nearby.
    Keep responses concise and empathetic.`;

    const tools: any[] = [];
    let toolConfig = undefined;

    // Enable Google Maps grounding if requested (e.g., explicitly or implicitly by the nature of the task)
    // To be safe, we always enable it if we have location, so the model can choose to use it.
    if (userLocation) {
        tools.push({ googleMaps: {} });
        toolConfig = {
            retrievalConfig: {
                latLng: {
                    latitude: userLocation.lat,
                    longitude: userLocation.lng
                }
            }
        };
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                tools: tools.length > 0 ? tools : undefined,
                toolConfig: toolConfig
            }
        });

        let text = response.text || "I'm here to listen.";

        // Append Grounding chunks (Google Maps Links) if present
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks && chunks.length > 0) {
            text += "\n\n**Nearby Recommendations:**\n";
            chunks.forEach((chunk: any) => {
                if (chunk.web?.uri && chunk.web?.title) {
                    text += `- [${chunk.web.title}](${chunk.web.uri})\n`;
                }
            });
        }
        
        return text;
    } catch (e) {
        console.error(e);
        return "I'm having trouble connecting to my services right now.";
    }
  },

  async analyzeAudioContext(textFromSpeech: string): Promise<string> {
      const prompt = `Analyze this spoken reflection for emotional state and stress: "${textFromSpeech}". Provide a brief, supportive insight in 2 sentences.`;
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
      });
      return response.text || "Could not analyze audio context.";
  },

  async analyzeDiagnostic(answers: string[], testType: string): Promise<string> {
      const prompt = `The user took a ${testType} test. Here are their answers: ${JSON.stringify(answers)}. Analyze these results, provide a risk assessment (Low/Medium/High) and professional recommendations. JSON format with 'assessment' and 'recommendation' fields.`;
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
      });
      return cleanJSON(response.text || "{}");
  }
};
