import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { RecoilRoot } from "recoil";

if (import.meta.env.DEV) {
  const { worker } = await import("@/mocks/browser");
  worker.start({
    onUnhandledRequest(req, print) {
      const allowedDomain = "chrome-extension:";
      const allowedDomain2 = "https://cdn.tldraw.com";
      const allowedDomain3 = " https://fonts.gstatic.com";

      if (
        req.url.pathname.startsWith("/public/") ||
        req.url.pathname.startsWith("/src/") ||
        req.url.pathname.startsWith("/dist/") ||
        req.url.href.startsWith(allowedDomain) ||
        req.url.href.startsWith(allowedDomain2) ||
        req.url.href.startsWith(allowedDomain3)
      ) {
        return;
      }

      print.warning();
    },
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>
);
