import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { track, useEditor } from "tldraw";

const TldrawCreateBox = track(() => {
  const editor = useEditor();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "c") {
        console.log("create");
        editor.createShape({
          type: "geo",
          props: {
            w: 512,
            h: 512,
            geo: "rectangle",
          },
          x: 0,
          y: 0,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
});

export default TldrawCreateBox;
