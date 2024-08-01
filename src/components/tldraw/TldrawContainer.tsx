import { useCallback, useEffect, useState } from "react";
import { Editor, Tldraw, TLEventInfo, track, useEditor } from "tldraw";
import "./index.scss";
import CursorChat from "@/components/cursorChat";

function TldrawContainer() {
  const [showTextarea, setShowTextarea] = useState(false);

  const handlePointerUp = useCallback((e: TLEventInfo) => {
    setShowTextarea(false);
  }, []);

  const mountHandler = useCallback(
    (editor: Editor) => {
      editor.user.updateUserPreferences({ colorScheme: "dark" });
      editor.updateInstanceState({
        isGridMode: true,
      });

      editor.on("event", (e) => {
        if (e.name === "pointer_up") {
          handlePointerUp(e);
          return;
        }
      });
    },
    [handlePointerUp]
  );

  return (
    <div className="absolute w-full h-full font-[Inter]">
      <Tldraw
        inferDarkMode={true}
        onMount={mountHandler}
        persistenceKey="testStoreKey"
      >
        <CustomUi showTextarea={showTextarea} />
        <CursorChat
          showTextarea={showTextarea}
          setShowTextarea={setShowTextarea}
        />
      </Tldraw>
    </div>
  );
}

const CustomUi = track(({ showTextarea }) => {
  const editor = useEditor();

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (showTextarea) {
        return;
      }

      switch (e.key) {
        case "Delete":
        case "Backspace": {
          editor.deleteShapes(editor.getSelectedShapeIds());
          break;
        }
        case "v": {
          editor.setCurrentTool("select");
          break;
        }
        case "e": {
          editor.setCurrentTool("eraser");
          break;
        }
        case "x":
        case "p":
        case "b":
        case "d": {
          editor.setCurrentTool("draw");
          break;
        }
      }
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  });

  return (
    <div className="custom-layout">
      <div className="custom-toolbar">
        <button
          className="custom-button"
          data-isactive={editor.getCurrentToolId() === "select"}
          onClick={() => editor.setCurrentTool("select")}
        >
          Select
        </button>
        <button
          className="custom-button"
          data-isactive={editor.getCurrentToolId() === "draw"}
          onClick={() => editor.setCurrentTool("draw")}
        >
          Pencil
        </button>
        <button
          className="custom-button"
          data-isactive={editor.getCurrentToolId() === "eraser"}
          onClick={() => editor.setCurrentTool("eraser")}
        >
          Eraser
        </button>
      </div>
    </div>
  );
});

export default TldrawContainer;
