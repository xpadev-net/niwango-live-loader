import { ThreadsApiThread } from "@/@types/threads";

export type NiwangoIframe = {
  contentWindow: {
    init: (threads: ThreadsApiThread[]) => void;
    updateTime: (currentTime: number, paused: boolean) => void;
  };
} & HTMLIFrameElement;
