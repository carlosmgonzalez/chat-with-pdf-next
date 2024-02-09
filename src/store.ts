import { create } from "zustand";

export const APP_STATUS = {
  INIT: 0,
  LOADING: 1,
  CHAT_MODE: 2,
  ERROR: -1,
};

interface AppStatus {
  appState: number;
  appStatusInfo: {
    id: string;
    url: string;
    pages: number;
  };
  setAppStatusLoading: () => void;
  setAppStatusError: () => void;
  setAppStatusChatMode: ({
    id,
    url,
    pages,
  }: {
    id: string;
    url: string;
    pages: number;
  }) => void;
}

export const useAppStatus = create<AppStatus>((set) => ({
  appState: APP_STATUS.INIT,
  appStatusInfo: {
    id: "",
    pages: 0,
    url: "",
  },
  setAppStatusLoading: () => set({ appState: APP_STATUS.LOADING }),
  setAppStatusError: () => set({ appState: APP_STATUS.ERROR }),
  setAppStatusChatMode: ({ id, pages, url }) =>
    set(() => {
      return {
        appStatusInfo: {
          id,
          pages,
          url,
        },
        appState: APP_STATUS.CHAT_MODE,
      };
    }),
}));

// appState: APP_STATUS.CHAT_MODE,
// appStatusInfo: {
//   id: "db26d9c6262364c01636e0160acbc959",
//   pages: 2,
//   url: "https://res.cloudinary.com/difikt7so/image/upload/v1707449081/pdf/kpwkeauat4oqw4hz1kml.pdf",
// },
