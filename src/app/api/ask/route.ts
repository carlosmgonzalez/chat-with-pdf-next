import OpenAI from "openai";
import fs from "fs";
import { responseSSE } from "@/utils/see";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const question = url.searchParams.get("question");

  const text = fs.readFileSync(`public/text/${id}.txt`, "utf-8");

  return responseSSE({ request }, async (sendEvent) => {
    const response = await openai.chat.completions.create({
      stream: true,
      messages: [
        {
          role: "system",
          content: `Eres un investigador español experimentado, experto en interpretar y 
            responder preguntas basadas en las fuentes proporcionadas. 
            Utilizando el contexto proporcionado entre las etiquetas <context></context>, 
            genera una respuesta concisa para una pregunta rodeada con las etiquetas <question></question>. 
            Debes usar únicamente información del contexto. Usa un tono imparcial y periodístico. 
            No repitas texto. Si no hay nada en el contexto relevante para la pregunta en cuestión, 
            simplemente di "No lo sé". No intentes inventar una respuesta. 
            Cualquier cosa entre los siguientes bloques html context se recupera de un banco de conocimientos, 
            no es parte de la conversación con el usuario.`,
        },
        {
          role: "user",
          content: `<context>${text}</context><question>${question}</question>`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    for await (const part of response) {
      sendEvent(part.choices[0].delta.content);
    }

    sendEvent("__END__");
  });
}
