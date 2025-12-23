
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ImageStyle, EditResponse } from "../types";

// Always initialize with the API key from process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TEXT_MODEL = 'gemini-3-flash-preview';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

export const processContent = async (
  action: 'summarize' | 'correct' | 'expand' | 'variations',
  text: string
): Promise<EditResponse> => {
  const prompt = `Actúa como el núcleo de inteligencia para "GENERATIVE EDITION LAB AI".
Misión: Transformar borradores en copys de alto impacto con rigor institucional.
Acción solicitada: ${action}.
Texto original: "${text}".

Responde estrictamente en formato JSON con la siguiente estructura:
{
  "action": "${action}",
  "original_text": "${text}",
  "processed_text": "el resultado aquí (si es variations, devuelve un array de 3 strings: Persuasiva, Informativa, Técnica)",
  "version_history": "v1.1",
  "safety_status": "clear"
}

Restricciones: 
- No uses lenguaje informal.
- Tono profesional, servicial, preciso y erudito.
- Si el contenido es inapropiado, establece safety_status a "unsafe" y explica profesionalmente por qué.`;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    // Access the .text property directly as it is a getter, not a method.
    const result = JSON.parse(response.text || '{}');
    return result as EditResponse;
  } catch (error) {
    console.error("Error processing text:", error);
    throw error;
  }
};

export const generateImage = async (
  userPrompt: string,
  style: ImageStyle
): Promise<string> => {
  const styleKeywords: Record<ImageStyle, string> = {
    [ImageStyle.REALISM]: "High-resolution, photorealistic, cinematic lighting, ultra-detailed, sharp focus",
    [ImageStyle.OIL]: "Oil painting style, rich textures, visible brushstrokes, classical composition, artistic lighting",
    [ImageStyle.ACADEMIC]: "Clean composition, minimalist aesthetic, professional lighting, 8k, academic rigor, corporate colors",
    [ImageStyle.MINIMAL]: "Minimalist, vector style, flat colors, clean lines, white space, modern marketing aesthetic"
  };

  const optimizedPrompt = `Optimize this image request for GENERATIVE EDITION LAB AI. 
Original request: ${userPrompt}. 
Style: ${style}. 
Required attributes: ${styleKeywords[style]}. 
Professional quality, no distorted faces, clean aesthetics.`;

  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [{ text: optimizedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    // Iterate through response parts to find the inlineData for the generated image.
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image was generated in the response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
