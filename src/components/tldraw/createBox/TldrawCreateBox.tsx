import { cursorChatVisibleState } from "@/stores/cursorChat";
import { isCanvasLoadingState } from "@/stores/tldraw";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { TLGeoShape, createShapeId, track, useEditor } from "tldraw";
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
        editor.createShape<TLGeoShape>({
          id: shapeId,
          type: "geo",
          props: {
            w: 512,
            h: 512,
            geo: "rectangle",
            fill: "fill",
            color: "white",
          },
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
