import { Spinner } from "flowbite-react";

export const StepLoading = () => {
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <Spinner className="fill-blue-700" />
      <p className="opacity-75">Subiendo el archivo y extrayendo el texto...</p>
    </div>
  );
};
