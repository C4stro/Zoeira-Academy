import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Course } from "../types";

// Schema definition moved outside to avoid recreation
const courseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Título curto e engraçado." },
    subtitle: { type: Type.STRING, description: "Subtítulo de 1 linha." },
    instructorName: { type: Type.STRING },
    instructorBio: { type: Type.STRING, description: "Bio curta e absurda (max 2 frases)." },
    description: { type: Type.STRING, description: "Descrição de 2 parágrafos curtos." },
    price: { type: Type.STRING },
    rating: { type: Type.NUMBER },
    studentCount: { type: Type.INTEGER },
    tags: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "3 tags engraçadas."
    },
    testimonial: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        text: { type: Type.STRING, description: "Depoimento curto." }
      }
    },
    modules: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING, description: "Descrição de 1 frase." },
          lessons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                duration: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  },
  required: ["title", "subtitle", "instructorName", "modules", "description", "price"]
};

// Helper function to lazy load the AI client
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key não configurada. Verifique as variáveis de ambiente no Vercel.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCourseContent = async (topic: string): Promise<Course> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Gere um curso online SATÍRICO sobre: "${topic}".
      
      IMPORTANTE PARA VELOCIDADE:
      1. Gere APENAS 3 módulos.
      2. Cada módulo deve ter APENAS 2 aulas.
      3. Seja breve e direto nas descrições, mas mantenha o humor absurdo.
      4. O tom deve ser paródia de marketing digital/coach.
      
      Use português do Brasil informal.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: courseSchema,
        temperature: 1.2,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Sem resposta da IA");
    
    return JSON.parse(jsonText) as Course;
  } catch (error) {
    console.error("Erro ao gerar curso:", error);
    throw error;
  }
};

export const generateLessonContent = async (courseTitle: string, moduleTitle: string, lessonTitle: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Contexto: Curso de comédia "${courseTitle}".
      Tarefa: Escreva o texto da aula "${lessonTitle}" (Módulo: "${moduleTitle}").
      Estilo: Engraçado, pseudociência, coach quântico maluco.
      Formato: Markdown. Max 200 palavras (seja rápido).`,
      config: {
        temperature: 1.3,
      }
    });

    return response.text || "Conteúdo indisponível no plano astral atual.";
  } catch (error) {
    console.error("Erro ao gerar aula:", error);
    return "Erro de conexão com o além (API Error).";
  }
};