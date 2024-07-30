import { useCallback, useEffect } from "react";
import { Editor, Tldraw, track, useEditor, useToasts } from "tldraw";
// import { useSyncDemo } from "@tldraw/sync";
import "./index.scss";

function TldrawContainer() {
  // const store = useSyncDemo({ roomId: "my-unique-room-id222" });

  const mountHandler = useCallback((editor: Editor) => {
    editor.user.updateUserPreferences({ colorScheme: "dark" });
    editor.updateInstanceState({
      isGridMode: true,
    });

    console.log(editor.store);
  }, []);

  return (
    <div className="absolute w-full h-full font-[Inter]">
      <Tldraw onMount={mountHandler} persistenceKey="testStoreKey">
        <CustomUi />
      </Tldraw>
    </div>
  );
}

const CustomUi = track(() => {
  const editor = useEditor();
  const { addToast } = useToasts();

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
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
        case "/":
          editor.updateInstanceState({
            isChatting: true,
            chatMessage: "tetetet",
          });
          break;
        case "p":
          addToast({
            title: "Toast Test Title",
            description: "Toast Test Desc",
          });
          break;
        case "b":
          break;
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
    <>
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
      <div className="absolute top-[6rem] left-[3rem] text-white">
        {editor.getSelectedShapes().map((shape, i) => {
          return (
            <p key={shape.id} className="flex flex-col mb-[1.2rem]">
              <span>{i + 1}. </span>
              <span>x: {shape.x}</span>
              <span>y: {shape.y}</span>
              <span>w: {shape.props.w || ""}</span>
              <span>h: {shape.props.h || ""}</span>
              <span>type: {shape.type}</span>
              <span>id: {shape.id}</span>
            </p>
          );
        })}
      </div>
    </>
  );
});

export default TldrawContainer;
