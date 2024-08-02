import { Editor, TLEventInfo } from "tldraw";

export default function useTldrawMountHandler(editor: Editor) {
  editor.user.updateUserPreferences({ colorScheme: "dark" });
  editor.updateInstanceState({
    isGridMode: true,
  });

  const handlePointerDown = (e: TLEventInfo) => {
    const isSelect = !!editor.getSelectedShapes().length;
    if (isSelect) {
      console.log(isSelect);
    }

    if (!isSelect) {
      console.log(`event name :${e.name}`);
    }
  };

  const handlePointerUp = (e: TLEventInfo) => {
    console.log(`event name :${e.name}`);
  };

  editor.on("event", (e) => {
    if (e.name === "pointer_down") {
      // handlePointerDown(e);
      return;
    }
    if (e.name === "pointer_up") {
      // handlePointerUp(e);
      return;
    }
  });
}
