import CursorChatContainer from "@/components/cursorChat/CursorChatContainer";
import TldrawContainer from "@/components/tldraw/TldrawContainer";

export default function MainPage() {
  return (
    <>
      <div className="relative w-full h-[100svh]">
        <TldrawContainer />
        <CursorChatContainer />
      </div>
    </>
  );
}
