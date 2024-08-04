import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { RecoilRoot } from "recoil";
import { ChainlitAPI, ChainlitContext } from "@chainlit/react-client";

const CHAINLIT_SERVER_URL = import.meta.env.VITE_BACKEND_URL;
const apiClient = new ChainlitAPI(CHAINLIT_SERVER_URL, "webapp");

if (import.meta.env.DEV) {
  const { worker } = await import("@/mocks/browser");
  worker.start({
    onUnhandledRequest(req, print) {
      const allowedDomain = "chrome-extension:";
      const allowedDomain2 = "https://cdn.tldraw.com";
      const allowedDomain3 = "https://fonts.gstatic.com";
      const allowedDomain4 = CHAINLIT_SERVER_URL;

      if (
        req.url.pathname.startsWith("/images/") ||
        req.url.pathname.startsWith("/public/") ||
        req.url.pathname.startsWith("/src/") ||
        req.url.pathname.startsWith("/dist/") ||
        req.url.href.startsWith(allowedDomain) ||
        req.url.href.startsWith(allowedDomain2) ||
        req.url.href.startsWith(allowedDomain3) ||
        req.url.href.startsWith(allowedDomain4)
      ) {
        return;
      }

      print.warning();
    },
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChainlitContext.Provider value={apiClient}>
      <BrowserRouter>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </BrowserRouter>
    </ChainlitContext.Provider>
  </React.StrictMode>
);
