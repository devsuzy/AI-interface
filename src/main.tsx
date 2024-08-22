import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { RecoilRoot } from "recoil";
import { ChainlitAPI, ChainlitContext } from "@chainlit/react-client";

const CHAINLIT_SERVER_URL = import.meta.env.VITE_BACKEND_URL;
const apiClient = new ChainlitAPI(CHAINLIT_SERVER_URL, "webapp");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <ChainlitContext.Provider value={apiClient}> */}
    <BrowserRouter>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </BrowserRouter>
    {/* </ChainlitContext.Provider> */}
  </React.StrictMode>
);
