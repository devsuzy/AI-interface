import { Editor, Tldraw } from "tldraw";
import { useSetRecoilState } from "recoil";
import { cursorChatVisibleState } from "@/stores/cursorChat";
import "./index.scss";
import TldrawPrompt from "@/components/tldraw/prompt/TldrawPrompt";
import { useChatSession } from "@chainlit/react-client";
import { useEffect } from "react";

function TldrawContainer() {
  const setShowTextarea = useSetRecoilState(cursorChatVisibleState);
  const { connect, disconnect, chatProfile, setChatProfile } = useChatSession();

  const mountHandler = (editor: Editor) => {
    editor.user.updateUserPreferences({ colorScheme: "dark" });
    editor.updateInstanceState({
      isGridMode: true,
    });

    editor.on("event", (e) => {
      if (e.name === "pointer_up") {
        setShowTextarea(false);
        return;
      }
    });
  };

  // useEffect(() => {
  //   connect({
  //     userEnv: {},
  //   });
  //   return () => {
  //     disconnect();
  //   };
  // }, []);

  return (
    <div className={`absolute w-full h-full font-[Inter]`}>
      <Tldraw onMount={mountHandler} persistenceKey="testStoreKey">
        <TldrawPrompt />
      </Tldraw>
    </div>
  );
}

export default TldrawContainer;
