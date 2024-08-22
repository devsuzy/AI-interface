import { Editor, Tldraw } from "tldraw";
import { useSetRecoilState } from "recoil";
import { cursorChatVisibleState } from "@/stores/cursorChat";
import TldrawPrompt from "@/components/tldraw/prompt/TldrawPrompt";
import TldrawCreateBox from "@/components/tldraw/createBox/TldrawCreateBox";
import { RectShapeUtil } from "@/libs/tldraw/RectShapeUtil";
import "./index.scss";

function TldrawContainer() {
  const setShowTextarea = useSetRecoilState(cursorChatVisibleState);

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
      <Tldraw
        shapeUtils={[RectShapeUtil]}
        onMount={mountHandler}
        persistenceKey="mm"
      >
        <TldrawPrompt />
        <TldrawCreateBox />
      </Tldraw>
    </div>
  );
}

export default TldrawContainer;
