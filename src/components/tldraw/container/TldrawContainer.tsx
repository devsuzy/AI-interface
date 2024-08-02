import { useEffect } from "react";
import { Tldraw, track, useEditor, useToasts } from "tldraw";
import useTldrawMount from "@/hooks/tldraw/useTldrawMount";
import "./index.scss";
import TldrawPrompt from "@/components/tldraw/prompt/TldrawPrompt";
import { useChatSession } from "@chainlit/react-client";
// import { useSyncDemo } from "@tldraw/sync";

function TldrawContainer() {
  // const store = useSyncDemo({ roomId: "my-unique-room-id222" });
  const mountHandler = useTldrawMount;
  const { connect, disconnect } = useChatSession();

  useEffect(() => {
    connect({
      userEnv: { test: "test" },
    });

    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className="absolute w-full h-full font-[Inter]">
      <Tldraw onMount={mountHandler} persistenceKey="testStoreKey">
        <TldrawPrompt />
      </Tldraw>
    </div>
  );
}

export default TldrawContainer;
