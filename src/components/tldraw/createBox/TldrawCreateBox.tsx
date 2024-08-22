import { MyRectShape } from "@/libs/tldraw/RectShapeUtil";
import { cursorChatVisibleState } from "@/stores/cursorChat";
import { isCanvasLoadingState } from "@/stores/tldraw";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { createShapeId, track, useEditor } from "tldraw";
import { v4 as uuid } from "uuid";

const TldrawCreateBox = track(() => {
  const editor = useEditor();
  const isLoading = useRecoilValue(isCanvasLoadingState);
  const showTextarea = useRecoilValue(cursorChatVisibleState);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading || showTextarea) return;

      if (e.key === "c" || e.key === "ㅊ") {
        const inputs = editor.inputs;
        if (!inputs) return;

        const shapeId = createShapeId("user-rect" + uuid());

        editor.createShape<MyRectShape>({
          id: shapeId,
          type: "my-rect-shape",
          x: inputs.currentPagePoint.x,
          y: inputs.currentPagePoint.y,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLoading, showTextarea, editor]);

  return null;
});

export default TldrawCreateBox;
