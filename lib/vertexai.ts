import { VertexAI, GenerativeModel } from "@google-cloud/vertexai";

// Lazy initialization to avoid build-time errors
let vertexAI: VertexAI | null = null;
let generativeModel: GenerativeModel | null = null;

function getModel(): GenerativeModel {
  if (!generativeModel) {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT;
    if (!projectId) {
      throw new Error(
        "GOOGLE_CLOUD_PROJECT environment variable is not set. " +
          "Please set it to your Google Cloud project ID."
      );
    }

    vertexAI = new VertexAI({
      project: projectId,
      location: "us-central1",
    });

    generativeModel = vertexAI.getGenerativeModel({
      model: "gemini-2.0-flash-001",
    });
  }

  return generativeModel;
}

export async function generateContent(prompt: string): Promise<string> {
  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = result.response;

    if (response.candidates && response.candidates[0]?.content?.parts) {
      return response.candidates[0].content.parts
        .map((part) => part.text || "")
        .join("");
    }

    return "No response generated";
  } catch (error) {
    console.error("Vertex AI Error:", error);
    throw error;
  }
}

export async function summarizeNote(content: string): Promise<string> {
  const prompt = `Please provide a concise summary of the following note. Keep it brief but capture the key points:

Note content:
${content}

Summary:`;

  return generateContent(prompt);
}

export async function extractActionItems(content: string): Promise<string> {
  const prompt = `Extract all action items, tasks, or to-dos from the following note. Format them as a numbered list. If there are no action items, say "No action items found."

Note content:
${content}

Action Items:`;

  return generateContent(prompt);
}

export async function improveWriting(content: string): Promise<string> {
  const prompt = `Please improve the following text by:
1. Fixing any grammar or spelling errors
2. Improving clarity and readability
3. Making it more professional while keeping the original meaning

Keep the improved version similar in length to the original.

Original text:
${content}

Improved text:`;

  return generateContent(prompt);
}
