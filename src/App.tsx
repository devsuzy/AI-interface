import "./global.scss";
import { routes } from "@/routes";
import { getClient } from "@/libs/http/queryClient";
import { useRoutes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RecoilRoot } from "recoil";
import { ChainlitAPI, ChainlitContext } from "@chainlit/react-client";

// const CHAINLIT_SERVER_URL = "http://localhost:8000";

// const apiClient = new ChainlitAPI(CHAINLIT_SERVER_URL, "webapp");

function App() {
  const element = useRoutes(routes);
  const queryClient = getClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {element}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
