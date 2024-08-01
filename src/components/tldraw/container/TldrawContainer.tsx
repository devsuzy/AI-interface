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
      <Tldraw hideUi onMount={mountHandler} persistenceKey="testStoreKey">
        <CustomUi />
        <TldrawPrompt />
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
        {editor.getSelectedShapes().map((shape: any, i) => {
          if (shape.props) {
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
          } else {
            return (
              <p key={shape.id} className="flex flex-col mb-[1.2rem]">
                <span>{i + 1}. </span>
                <span>x: {shape.x}</span>
                <span>y: {shape.y}</span>
                <span>type: {shape.type}</span>
                <span>id: {shape.id}</span>
              </p>
            );
          }
        })}
      </div>
    </>
  );
});

export default TldrawContainer;
