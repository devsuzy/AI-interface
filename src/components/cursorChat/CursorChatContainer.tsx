import CursorChat from "@/components/cursorChat";
import { cursorState } from "@/stores/cursorChat";
import { useRecoilValue } from "recoil";

export default function CursorChatContainer() {
  const showTextarea = useRecoilValue(cursorState);

  return (
    <>
      <CursorChat showTextarea={showTextarea} />
    </>
  );
}
