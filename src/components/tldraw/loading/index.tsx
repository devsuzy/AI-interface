import { isCanvasLoadingState } from "@/stores/tldraw";
import { useRecoilValue } from "recoil";

export default function TldrawLoading() {
  const isLoading = useRecoilValue(isCanvasLoadingState);
  if (!isLoading) return null;
  return (
    <div className="fixed left-0 top-0 w-full h-full bg-white/40 flex justify-center items-center z-[10]">
      Loading...
    </div>
  );
}
