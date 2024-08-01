import { useCallback, useEffect, useState } from "react";
import { Editor, Tldraw, TLEventInfo, track, useEditor } from "tldraw";
import "./index.scss";
import { useSetRecoilState } from "recoil";
import { cursorState } from "@/stores/cursorChat";

function TldrawContainer() {
  const setShowTextarea = useSetRecoilState(cursorState);

  console.log("ddf");

  const mountHandler = useCallback((editor: Editor) => {
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
  }, []);

  return (
    <div className="absolute w-full h-full font-[Inter]">
      <Tldraw
        inferDarkMode={true}
        onMount={mountHandler}
        persistenceKey="testStoreKey"
        hideUi
      ></Tldraw>
    </div>
  );
}

export default TldrawContainer;
