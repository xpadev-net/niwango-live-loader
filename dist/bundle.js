/* Version: 0.0.5 - June 10, 2023 18:16:58 */
// ==UserScript==
// @name         niwango.js live loader
// @namespace    https://xpadev.net/
// @version      0.0.5
// @description  ニコニコ動画上でニワン語を実行するための試験的スクリプト
// @author       xpadev
// @match        https://www.nicovideo.jp/watch/*
// @grant        none
// ==/UserScript==
/*!
  niwango.js live loader
  (c) 2023 xpadev-net https://xpadev.net
  Released under the MIT License.
  */
/**
 * # 【重要】利用される方へ
 * 処理に使用しているniwango.jsはまだ開発途中であり、予期しない不具合によって異常な負荷がかかったり、突然動作しなくなったりする可能性があります
 * 使用する際は自己責任でお願いします
 *
 * # 使い方
 * 1. このスクリプトをTampermonkeyなどのユーザースクリプトマネージャーに登録する
 * 2. ニコニコ動画の動画再生ページを開く
 * 3. シークバーを動画の開始地点まで移動する
 * 4. 動画再生画面の右側の「コメントリスト」タブを開く
 * 5. 「コメントリスト」タブの下にある「ﾆﾜ」ボタンを押す
 *
 * # 更新について
 * GitHub上に公開されている最新のコードを自動的に読み込むため、基本的に更新は必要ありません
 */

(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }
    function __generator(thisArg, body) {
      var _ = {
          label: 0,
          sent: function () {
            if (t[0] & 1) throw t[1];
            return t[1];
          },
          trys: [],
          ops: []
        },
        f,
        y,
        t,
        g;
      return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
      }), g;
      function verb(n) {
        return function (v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return {
                value: op[1],
                done: false
              };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    }

    var typeguard = {
        threadsApiResponse: function (i) {
            return !!i &&
                typeof i === "object" &&
                i.meta.status === 200;
        },
    };

    var Niwango_IFrame_SrcDoc = "<!DOCTYPE html>\n<html lang=\"ja\">\n<head>\n    <meta charset=\"UTF-8\">\n    <script src=\"https://xpadev-net.github.io/niwango.js/niwango.js\"></script>\n</head>\n<body>\n<canvas id=\"canvas\" width=\"1920\" height=\"1080\"></canvas>\n<div id=\"loading\">読み込み中...</div>\n</body>\n<script>\n    let niwango,interval=0,currentTime=0,videoMicroSec=false;\n    const canvasElement = document.getElementById(\"canvas\");\n    const context = canvasElement.getContext(\"2d\");\n    const updateCanvas = () => {\n        if (!niwango) return;\n        context.clearRect(0,0,canvasElement.width,canvasElement.height);\n        if (!videoMicroSec) {\n            niwango.draw(Math.floor(currentTime * 100));\n        } else {\n            niwango.draw(\n                Math.floor(\n                    (performance.now() - videoMicroSec.microsec) / 10 +\n                    videoMicroSec.currentTime * 100\n                )\n            );\n        }\n    };\n    const init = (threads) => {\n        document.getElementById(\"loading\").remove();\n        const comments = [];\n        for (const thread of threads){\n            for (const comment of thread.comments){\n                comments.push({\n                    message: comment.body,\n                    vpos: Math.floor(comment.vposMs/10)/100,\n                    isYourPost: comment.isMyPost,\n                    mail: comment.commands.join(\" \"),\n                    fromButton: false,\n                    color: 0,\n                    size: 0,\n                    no: comment.no,\n                    _vpos: Math.floor(comment.vposMs/10),\n                    _owner: thread.fork === \"owner\"\n                });\n            }\n        }\n\n        niwango=new Niwango(canvasElement,comments)\n        if (!interval){\n            interval = setInterval(updateCanvas, 1);\n        }\n    }\n\n    const updateTime = (currentTime, paused) => {\n        if (!paused) {\n            videoMicroSec = {\n                currentTime: currentTime,\n                microsec: performance.now(),\n            };\n        } else {\n            videoMicroSec = false;\n        }\n    };\n    window.init=init;\n    window.updateTime=updateTime;\n    window.onload = async() => {\n        try{\n            const req = await fetch(\"https://xpadev-net.github.io/niwango-live-loader/package.json\");\n            const json = await req.json();\n            if (json.version !== '0.0.5') {\n                const newer = json.version.match(/(?<major>\\d)\\.(?<minor>\\d)\\.(?<patched>\\d)/);\n                const current = '{version}'.match(/(?<major>\\d)\\.(?<minor>\\d)\\.(?<patched>\\d)/);\n                const element = document.createElement(\"div\");\n                element.innerHTML = `<div style=\"position: absolute;right: 0;bottom: 0;font-size: 20px;color: #fff;background: rgba(0,0,0,0.5);padding: 10px;\">新しいバージョンがリリースされています。最新版への更新をお願いします</div>`\n                document.body.append(element);\n                if (newer.groups.major === current.groups.major){\n                    setTimeout(()=>element.remove(),5000);\n                }\n            }\n        }catch (_){\n            const element = document.createElement(\"div\");\n            element.innerHTML = `<div style=\"position: absolute;right: 0;bottom: 0;font-size: 20px;color: #fff;background: rgba(0,0,0,0.5);padding: 10px;\">バージョン情報の取得に失敗しました<br>ネットワークの接続とUserScriptの更新を確認してください</div>`\n            document.body.append(element);\n            setTimeout(()=>element.remove(),5000);\n        }\n    }\n</script>\n<style>\n    *{\n        margin: 0;\n        padding: 0;\n    }\n    html,body,#canvas{\n        width: 100%;\n        height: 100%;\n        background: transparent;\n        overflow: hidden;\n    }\n    #loading{\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        transform: translate(-50%,-50%);\n        font-size: 50px;\n        color: #fff;\n        background: rgba(0,0,0,0.5);\n    }\n    #canvas{\n        object-fit: contain;\n    }\n</style>\n</html>";

    var Niwango_Loader_Id = "niwango-loader";
    var Niwango_IFrame_Id = "niwango-iframe";
    (function () {
        var _this = this;
        var lastComment;
        var originalFetch = window.fetch;
        window.fetch = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var request, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, originalFetch.apply(void 0, args)];
                        case 1:
                            request = _a.sent();
                            if (!(args[0] === "https://nvcomment.nicovideo.jp/v1/threads")) return [3, 3];
                            return [4, request.clone().json()];
                        case 2:
                            result = (_a.sent());
                            if (typeguard.threadsApiResponse(result)) {
                                lastComment = result.data.threads.map(function (thread) {
                                    thread.comments = thread.comments.map(function (comment) {
                                        comment.commands.push("invisible");
                                        return comment;
                                    });
                                    return thread;
                                });
                            }
                            _a.label = 3;
                        case 3: return [2, request];
                    }
                });
            });
        };
        var getElement = function (selector) {
            return new Promise(function (resolve) {
                var interval = setInterval(function () {
                    var target = document.getElementsByClassName(selector);
                    if (Array.from(target).length > 0) {
                        clearInterval(interval);
                        resolve(Array.from(target));
                    }
                }, 200);
            });
        };
        var interval = 0;
        var setup = function () { return __awaiter(_this, void 0, void 0, function () {
            var player, video, iframe;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, getElement("MainVideoPlayer")];
                    case 1:
                        player = (_b.sent())[0];
                        if (!player)
                            throw new Error("failed to get player element");
                        video = player.getElementsByTagName("video")[0];
                        if (!video)
                            throw new Error("failed to get video element");
                        (_a = document.getElementById(Niwango_IFrame_Id)) === null || _a === void 0 ? void 0 : _a.remove();
                        clearInterval(interval);
                        iframe = document.createElement("iframe");
                        iframe.id = Niwango_IFrame_Id;
                        iframe.srcdoc = Niwango_IFrame_SrcDoc;
                        iframe.setAttribute("style", "position: relative; width: 100%; height: 100%;border: none;pointer-events: none;");
                        iframe.setAttribute("frameborder", "0");
                        video.after(iframe);
                        iframe.onload = function () {
                            iframe.contentWindow.init(lastComment);
                            iframe.contentWindow.updateTime(0, true);
                            interval = window.setInterval(function () {
                                var _a;
                                if (!iframe) {
                                    clearInterval(interval);
                                }
                                var currentTime = window.__videoplayer.currentTime();
                                var paused = window.__videoplayer.paused();
                                (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.updateTime(currentTime, paused);
                            }, 100);
                        };
                        return [2];
                }
            });
        }); };
        var addButton = function () { return __awaiter(_this, void 0, void 0, function () {
            var wrapper, loader;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (document.getElementById(Niwango_Loader_Id))
                            return [2];
                        return [4, getElement("DropDownMenu")];
                    case 1:
                        wrapper = (_a.sent())[0];
                        if (!wrapper)
                            throw new Error("failed to get wrapper element");
                        loader = document.createElement("div");
                        loader.innerHTML = "ﾆﾜ";
                        loader.setAttribute("style", "display: inline-block;padding: 4px;border: solid 1px;margin: 4px;cursor:pointer;");
                        loader.onclick = setup;
                        loader.id = Niwango_Loader_Id;
                        wrapper.after(loader);
                        return [2];
                }
            });
        }); };
        var init = function () { return __awaiter(_this, void 0, void 0, function () {
            var commentListTab, _a, _b, observer, canonicalLink;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        clearInterval(interval);
                        _b = (_a = Array).from;
                        return [4, getElement("PlayerPanelContainer-tabItem")];
                    case 1:
                        commentListTab = _b.apply(_a, [_c.sent()]).filter(function (element) { return element.innerText === "コメントリスト"; })[0];
                        if (!commentListTab)
                            throw new Error("failed to get commentListTab element");
                        commentListTab.addEventListener("click", function () { return void addButton(); });
                        void addButton();
                        observer = new MutationObserver(function () {
                            var _a;
                            observer.disconnect();
                            (_a = document.getElementById(Niwango_IFrame_Id)) === null || _a === void 0 ? void 0 : _a.remove();
                        });
                        canonicalLink = document.querySelector("link[rel=canonical]");
                        if (!canonicalLink)
                            throw new Error("failed to get ContentTree element");
                        observer.observe(canonicalLink, { childList: true });
                        return [2];
                }
            });
        }); };
        void init();
    })();

}));
