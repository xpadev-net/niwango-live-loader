import { typeguard } from "@/typeguard";
import { ThreadsApiThread } from "@/@types/threads";
import { NiwangoIframe } from "@/@types/iframe";

const Niwango_Loader_Id = "niwango-loader";
const Niwango_IFrame_Id = "niwango-iframe";
const Niwango_IFrame_SrcDoc = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <script src="https://xpadev-net.github.io/niconicomments/bundle.js"></script>
  <script src="https://xpadev-net.github.io/niwango.js/bundle.js"></script>
</head>
<body>
  <canvas id="canvas" width="1920" height="1080"></canvas>
  <div id="loading">読み込み中...</div>
</body>
<script>
let nico,interval=0,currentTime=0,videoMicroSec=false;
const canvasElement = document.getElementById("canvas");
const updateCanvas = () => {
  if (!nico) return;
  if (!videoMicroSec) {
    nico.drawCanvas(Math.floor(currentTime * 100));
  } else {
    nico.drawCanvas(
      Math.floor(
        (performance.now() - videoMicroSec.microsec) / 10 +
          videoMicroSec.currentTime * 100
      )
    );
  }
};
const init = (data) => {
  document.getElementById("loading").remove();
  nico = new NiconiComments(canvasElement, data, {
    format: "v1",
    config: {
      plugins: window.Niwango ? [window.Niwango] : [],
    },
  });
  if (!interval){
    interval = setInterval(updateCanvas, 1);
  }
}

const updateTime = (currentTime, paused) => {
  if (!paused) {
    videoMicroSec = {
      currentTime: currentTime,
      microsec: performance.now(),
    };
  } else {
    videoMicroSec = false;
  }
};
window.init=init;
window.updateTime=updateTime;
</script>
<style>
*{
  margin: 0;
  padding: 0;
}
html,body,#canvas{
  width: 100%;
  height: 100%;
  background: transparent;
  overflow: hidden;
}
#loading{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  font-size: 50px;
  color: #fff;
  background: rgba(0,0,0,0.5);
}
#canvas{
  object-fit: contain;
}
</style>
</html>
`;

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
    const iframe = document.createElement("iframe") as NiwangoIframe;
    iframe.id = Niwango_IFrame_Id;
    iframe.srcdoc = Niwango_IFrame_SrcDoc;
    iframe.setAttribute(
      "style",
      "position: relative; width: 100%; height: 100%;border: none;"
    );
    iframe.setAttribute("frameborder", "0");
    video.after(iframe);
    iframe.onload = () => {
      iframe.contentWindow.init(
        lastComment.filter((thread) => thread.fork === "owner")
      );
      iframe.contentWindow.updateTime(0, true);
      interval = window.setInterval(() => {
        const currentTime = window.__videoplayer.currentTime();
        const paused = window.__videoplayer.paused();
        iframe.contentWindow.updateTime(currentTime, paused);
      }, 100);
    };
  };

  const addButton = async () => {
    if (document.getElementById(Niwango_Loader_Id)) return;
    const wrapper = (
      await getElement("GridCell CommentPanelMenuContainer-mainMenuArea")
    )[0];
    if (!wrapper) throw new Error("failed to get wrapper element");
    const loader = document.createElement("div");
    loader.innerHTML = "ﾆﾜ";
    loader.setAttribute(
      "style",
      "display: inline-block;padding: 4px;border: solid 1px;margin: 4px;cursor:pointer;"
    );
    loader.onclick = setup;
    loader.id = Niwango_Loader_Id;
    wrapper.append(loader);
  };

  const init = async () => {
    clearInterval(interval);
    const commentListTab = Array.from(
      await getElement("PlayerPanelContainer-tabItem")
    ).filter((element) => (element.innerText = "コメントリスト"))[0];
    if (!commentListTab)
      throw new Error("failed to get commentListTab element");
    commentListTab.addEventListener("click", () => void addButton());
    void addButton();
    const observer = new MutationObserver(() => {
      document.getElementById(Niwango_IFrame_Id)?.remove();
    });
    const canonicalLink = document.querySelector("link[rel=canonical]");
    if (!canonicalLink) throw new Error("failed to get ContentTree element");
    observer.observe(canonicalLink, { childList: true });
  };
  void init();
})();
