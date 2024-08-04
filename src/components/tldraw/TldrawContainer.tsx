import { Editor, Tldraw } from "tldraw";
import { useSetRecoilState } from "recoil";
import { cursorState } from "@/stores/cursorChat";
import "./container/index.scss";

function TldrawContainer() {
  const setShowTextarea = useSetRecoilState(cursorState);

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

  return (
    <div className={`absolute w-full h-full font-[Inter]`}>
      <Tldraw onMount={mountHandler} persistenceKey="testStoreKey"></Tldraw>
    </div>
  );
}

export default TldrawContainer;
