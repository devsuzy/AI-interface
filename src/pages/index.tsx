import CursorChatContainer from "@/components/cursorChat/CursorChatContainer";
import TldrawContainer from "@/components/tldraw/container/TldrawContainer";
import TldrawLoading from "@/components/tldraw/loading";

export default function MainPage() {
  return (
    <>
      <div className="relative w-full h-[100svh] overflow-hidden">
        <TldrawContainer />
        <CursorChatContainer />
        <TldrawLoading />
      </div>
    </>
  );
}
