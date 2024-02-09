"use client";

import { APP_STATUS, useAppStatus } from "@/store";
import { Alert } from "flowbite-react";
import { StepUpload } from "./StepUpload";
import { StepChat } from "./StepChat";
import { StepLoading } from "./StepLoading";

export const App = () => {
  const appState = useAppStatus((state) => state.appState);

  return (
    <div>
      {appState === APP_STATUS.LOADING && <StepLoading />}
      {appState === APP_STATUS.INIT && <StepUpload />}

      {appState === APP_STATUS.ERROR && (
        <Alert>
          <span className="font-medium">¡Algo salio mal!</span>
          Ocurrio un error en la aplicación
        </Alert>
      )}

      {appState === APP_STATUS.CHAT_MODE && <StepChat />}

      {/* {
        <div className="p-8">
          <Alert>
            <span className="font-medium">¡Acción no reconocida!</span>
            No se pude reconocer esta acción o estado
          </Alert>
        </div>
      } */}
    </div>
  );
};
