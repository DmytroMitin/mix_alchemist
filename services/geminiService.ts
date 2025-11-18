
import { GoogleGenAI, Type } from "@google/genai";
import { DrinkRecipe, Recommendation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getRecommendations = async (): Promise<Recommendation[]> => {
  const modelId = 'gemini-2.5-flash';
  const prompt = `
    Suggest 10 diverse, popular, and interesting cocktail or mocktail recommendations.
    Include a mix of timeless classics and trending modern drinks.
    Provide a short, catchy description (max 10 words) for each.
    Return strictly a JSON array of objects with keys: "name" and "description".
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
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
            },
            required: ["name", "description"],
          },
        },
      },
    });

    if (!response.text) return [];
    return JSON.parse(response.text) as Recommendation[];
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

export const generateRecipeByName = async (name: string): Promise<DrinkRecipe> => {
  const modelId = 'gemini-2.5-flash';
  
  const prompt = `
    Create a detailed recipe for the drink: "${name}".
    
    Ensure the recipe is realistic, tasty, and uses standard measurements.
    
    Return strictly JSON.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING, description: "A short, enticing description of the drink in 1-2 sentences." },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of ingredients with measurements" },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step by step instructions" },
          glassware: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
          flavorProfile: { type: Type.STRING, description: "e.g., Sweet, Sour, Bitter, Refreshing, Smoky" },
        },
        required: ["name", "description", "ingredients", "instructions", "glassware", "difficulty", "flavorProfile"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(response.text) as DrinkRecipe;
};

export const generateDrinkRecipe = async (selectedIngredients: string[]): Promise<DrinkRecipe> => {
  const modelId = 'gemini-2.5-flash';
  
  const prompt = `
    Create a unique and delicious drink recipe (cocktail or mocktail) using a subset or all of the following ingredients: ${selectedIngredients.join(', ')}.
    
    You may assume the user also has basic pantry staples like: Ice, Water, Sugar, Salt.
    
    If the selected ingredients include alcohol, make a cocktail. If not, or if the combination suggests a mocktail, make a mocktail.
    
    Ensure the recipe is realistic and tasty.
    
    Return strictly JSON.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING, description: "A short, enticing description of the drink in 1-2 sentences." },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of ingredients with measurements" },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step by step instructions" },
          glassware: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
          flavorProfile: { type: Type.STRING, description: "e.g., Sweet, Sour, Bitter, Refreshing, Smoky" },
        },
        required: ["name", "description", "ingredients", "instructions", "glassware", "difficulty", "flavorProfile"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(response.text) as DrinkRecipe;
};

export const generateDrinkImage = async (drinkName: string, description: string, glassware: string): Promise<string> => {
    const modelId = 'imagen-4.0-generate-001';
    
    const prompt = `Professional studio photography of a cocktail named "${drinkName}". 
    Description: ${description}. 
    Glassware: ${glassware}. 
    The lighting should be moody and elegant, typical of a high-end speakeasy bar. 
    4k resolution, shallow depth of field, garnish clearly visible.`;

    const response = await ai.models.generateImages({
        model: modelId,
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        }
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    
    if (!base64ImageBytes) {
        throw new Error("Failed to generate image");
    }

    return `data:image/jpeg;base64,${base64ImageBytes}`;
};
