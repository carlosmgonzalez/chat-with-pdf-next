"use client";

import { useAppStatus } from "@/store";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { Spinner } from "flowbite-react";

export const StepChat = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");
  const [question, setQuestion] = useState<string>("");

  const setAppStatusError = useAppStatus((state) => state.setAppStatusError);
  const { id, pages, url } = useAppStatus((state) => state.appStatusInfo);

  const numOfImagesToShow = Math.min(pages, 4);
  const images = Array.from({ length: numOfImagesToShow }, (_, i) => {
    return url
      .replace("upload", `upload/w_400,h_540,c_fill,pg_${i + 1}`)
      .replace(".pdf", ".jpg");
  });

  const handlerSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setAnswer("");

    const searchParams = new URLSearchParams();
    searchParams.append("id", id);
    searchParams.append("question", question);

    try {
      const eventSource = new EventSource(
        `/api/ask?${searchParams.toString()}`
      );

      eventSource.onmessage = (event) => {
        setIsLoading(false);
        const incomingData =
          event.data !== undefined ? JSON.parse(event.data) : null;

        if (incomingData === "__END__") {
          return eventSource.close();
        }

        setAnswer((prevAnswer) => prevAnswer + incomingData);
      };
    } catch (error) {
      setAppStatusError();
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, i) => (
          <Image
            width={400}
            height={540}
            className="rounded-md w-full h-auto aspect-[400/540]"
            key={i}
            src={image}
            alt={`Imagen de la pagina ${i + 1}`}
          />
        ))}
      </div>
      <form onSubmit={handlerSubmit}>
        <label className="block mb-2">Haz tu pregunta</label>
        <input
          type="text"
          id="question"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="¿De que trata el PDF?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        ></input>
      </form>
      {isLoading && (
        <div className="flex justify-center items-center flex-col gap-y-2">
          <Spinner color="blue" />
          <p className="opacity-75">Esperando respuesta...</p>
        </div>
      )}
      {answer && (
        <div className="overflow-auto w-full h-[350px] rounded-md bg-slate-100 p-4">
          <p className="font-medium">Respuesta:</p>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};
