import ExcalidrawContainer from "@/components/excalidraw/ExcalidrawContainer";
import TldrawContainer from "@/components/tldraw/TldrawContainer";

export default function MainPage() {
  return (
    <>
      <div className="relative w-full h-[100svh]">
        <TldrawContainer />
        {/* <ExcalidrawContainer /> */}
      </div>
    </>
  );
}
