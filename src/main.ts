import { typeguard } from "@/typeguard";
import { ThreadsApiThread } from "@/@types/threads";
import { NiwangoIframe } from "@/@types/iframe";
import Niwango_IFrame_SrcDoc from "./iframe.html";

const Niwango_Loader_Id = "niwango-loader";
const Niwango_IFrame_Id = "niwango-iframe";

(function () {
  "use strict";
  let lastComment: ThreadsApiThread[];
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const request = await originalFetch(...args);
    if (args[0] === "https://nvcomment.nicovideo.jp/v1/threads") {
      const result = (await request.clone().json()) as unknown;
      if (typeguard.threadsApiResponse(result)) {
        lastComment = result.data.threads.map((thread) => {
          thread.comments = thread.comments.map((comment) => {
            comment.commands.push("invisible");
            return comment;
          });
          return thread;
        });
      }
    }
    return request;
  };

  const getElement = (selector: string): Promise<HTMLElement[]> => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const target = document.getElementsByClassName(selector);
        if (Array.from(target).length > 0) {
          clearInterval(interval);
          resolve(Array.from(target) as HTMLElement[]);
        }
      }, 200);
    });
  };
  let interval = 0;

  const setup = async () => {
    const player = (await getElement("MainVideoPlayer"))[0];
    if (!player) throw new Error("failed to get player element");
    const video = player.getElementsByTagName("video")[0];
    if (!video) throw new Error("failed to get video element");
    document.getElementById(Niwango_IFrame_Id)?.remove();
    clearInterval(interval);
    const iframe = document.createElement("iframe") as NiwangoIframe;
    iframe.id = Niwango_IFrame_Id;
    iframe.srcdoc = Niwango_IFrame_SrcDoc;
    iframe.setAttribute(
      "style",
      "position: relative; width: 100%; height: 100%;border: none;pointer-events: none;"
    );
    iframe.setAttribute("frameborder", "0");
    video.after(iframe);
    iframe.onload = () => {
      iframe.contentWindow.init(lastComment);
      iframe.contentWindow.updateTime(0, true);
      interval = window.setInterval(() => {
        if (!iframe) {
          clearInterval(interval);
        }
        const currentTime = window.__videoplayer.currentTime();
        const paused = window.__videoplayer.paused();
        iframe.contentWindow?.updateTime(currentTime, paused);
      }, 100);
    };
  };

  const addButton = async () => {
    if (document.getElementById(Niwango_Loader_Id)) return;
    const wrapper = (await getElement("DropDownMenu"))[0];
    if (!wrapper) throw new Error("failed to get wrapper element");
    const loader = document.createElement("div");
    loader.innerHTML = "ﾆﾜ";
    loader.setAttribute(
      "style",
      "display: inline-block;padding: 4px;border: solid 1px;margin: 4px;cursor:pointer;"
    );
    loader.onclick = setup;
    loader.id = Niwango_Loader_Id;
    wrapper.after(loader);
  };

  const init = async () => {
    clearInterval(interval);
    const commentListTab = Array.from(
      await getElement("PlayerPanelContainer-tabItem")
    ).filter((element) => element.innerText === "コメントリスト")[0];
    if (!commentListTab)
      throw new Error("failed to get commentListTab element");
    commentListTab.addEventListener("click", () => void addButton());
    void addButton();
    const observer = new MutationObserver(() => {
      observer.disconnect();
      document.getElementById(Niwango_IFrame_Id)?.remove();
    });
    const canonicalLink = document.querySelector("link[rel=canonical]");
    if (!canonicalLink) throw new Error("failed to get ContentTree element");
    observer.observe(canonicalLink, { childList: true });
  };
  void init();
})();
