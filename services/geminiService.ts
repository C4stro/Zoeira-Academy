import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Course } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const courseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "O título engraçado e grandioso do curso." },
    subtitle: { type: Type.STRING, description: "Um subtítulo satírico prometendo resultados impossíveis." },
    instructorName: { type: Type.STRING, description: "Nome inventado e engraçado do instrutor." },
    instructorBio: { type: Type.STRING, description: "Biografia absurda do instrutor, listando feitos ridículos." },
    description: { type: Type.STRING, description: "Descrição detalhada do curso, usando linguagem corporativa para vender algo inútil." },
    price: { type: Type.STRING, description: "Preço absurdo (ex: R$ 9.000,00 ou 'Sua alma')." },
    rating: { type: Type.NUMBER, description: "Nota fictícia, geralmente muito alta ou ironicamente baixa (ex: 4.9)." },
    studentCount: { type: Type.INTEGER, description: "Número inflado de alunos." },
    tags: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Tags engraçadas relacionadas ao tema."
    },
    testimonial: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        text: { type: Type.STRING, description: "Depoimento de um aluno fictício que teve a vida 'transformada' de forma bizarra." }
      }
    },
    modules: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Título do módulo." },
          description: { type: Type.STRING, description: "O que o aluno vai 'aprender' neste módulo." },
          lessons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Título da aula." },
                duration: { type: Type.STRING, description: "Duração cômica (ex: '2 dias', '10ms')." }
              }
            }
          }
        }
      }
    }
  },
  required: ["title", "subtitle", "instructorName", "modules", "description", "price"]
};

export const generateCourseContent = async (topic: string): Promise<Course> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Gere um curso online SATÍRICO e de "ZOEIRA" sobre o tema: "${topic}". 
      O tom deve ser de comédia, parodiando cursos de coach, marketing digital ou tutoriais inúteis.
      Seja criativo, absurdo e engraçado. O curso deve parecer profissional visualmente, mas o conteúdo deve ser ridículo.
      Use português do Brasil informal e zoeiro.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: courseSchema,
        temperature: 1.2, // High creativity/chaos
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
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Contexto: Você é o instrutor de um curso online de comédia/sátira chamado "${courseTitle}".
      
      Tarefa: Escreva o roteiro/conteúdo detalhado da aula "${lessonTitle}" que pertence ao módulo "${moduleTitle}".
      
      Diretrizes de Estilo:
      - O texto deve ser extremamente engraçado, absurdo e "zoeiro".
      - Integre exemplos criativos como "10 formas de explodir um pudim com ciência", "física de espaguete dançante" ou coisas do tipo, se o tema permitir.
      - Invente pseudociência, cite estudos que não existem.
      - Use um tom de "Guru" misturado com "Maluco Beleza".
      - Formato: Markdown simples (use negrito, itálico, listas).
      - Tamanho: Cerca de 300 palavras de pura enrolação e comédia.`,
      config: {
        temperature: 1.3,
      }
    });

    return response.text || "Ocorreu um erro ao baixar este conhecimento proibido. O universo talvez não esteja pronto.";
  } catch (error) {
    console.error("Erro ao gerar aula:", error);
    return "O professor foi abduzido por alienígenas antes de escrever esta aula. Tente novamente.";
  }
};
