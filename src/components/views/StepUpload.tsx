"use client";

import { useAppStatus } from "@/store";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export const StepUpload = () => {
  const setAppStatusLoading = useAppStatus(
    (state) => state.setAppStatusLoading
  );
  const setAppStatusChatMode = useAppStatus(
    (state) => state.setAppStatusChatMode
  );
  const setAppStatusError = useAppStatus((state) => state.setAppStatusError);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);

        setAppStatusLoading();

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          return setAppStatusError();
        }

        const result = await res.json();

        const { id, pages, url } = result;

        setAppStatusChatMode({ id, pages, url });
      }
    },
    [setAppStatusLoading, setAppStatusChatMode, setAppStatusError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop,
    multiple: false,
  });

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <div className="bg-gray-100 border-2 border-gray-300 border-dashed rounded-xl p-4 flex justify-center">
          {isDragActive ? (
            <span className="opacity-70 text-center">Suelta aquí tu PDF</span>
          ) : (
            <span className="opacity-70 text-center">
              Arrastra y suelta aquí tu PDF
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
