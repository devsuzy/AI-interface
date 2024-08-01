import React, { useState, useEffect, useRef, FormEvent } from "react";
import styles from "./styles.module.scss";
import { useSetRecoilState } from "recoil";
import { cursorState } from "@/stores/cursorChat";

interface Cursor {
  id: string;
  x: number;
  y: number;
}
interface CursorChatProps {
  showTextarea: boolean;
}

const CursorChat = ({ showTextarea }: CursorChatProps) => {
  const setShowTextarea = useSetRecoilState(cursorState);
  const [cursors, setCursors] = useState<{ [key: string]: Cursor }>({});
  // const [cursors, setCursors] = useState<Cursor>({
  //   id: "",
  //   x: 0,
  //   y: 0,
  // });
  // const [cursors, setCursors] = useState<Partial<Cursor>>({});
  // const [isTyping, setIsTyping] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [textValue, setTextValue] = useState("");
  const isTextValue = textValue.trim().length > 0;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const position = { x: e.clientX, y: e.clientY };
      setMousePosition(position);
      // updateCursor("cursor", position);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        // setIsTyping(true);
        setShowTextarea(true);
        // showTextareaField("cursor", mousePosition);
      }
    };

    const handleClick = (e: MouseEvent) => {
      hideTextareaField("cursor");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
    };
  }, [showTextarea, mousePosition]);

  // const updateCursor = (id: string, position: { x: number; y: number }) => {
  //   setCursors((prevCursors) => ({
  //     ...prevCursors,
  //     [id]: { id, x: position.x, y: position.y },
  //   }));
  // };

  const showTextareaField = (
    id: string,
    position: { x: number; y: number }
  ) => {
    // if (!cursors[id]) {
    //   setCursors((prevCursors) => ({
    //     ...prevCursors,
    //     [id]: { id, x: position.x, y: position.y },
    //   }));
    // }
  };

  const hideTextareaField = (id: string) => {
    setShowTextarea(false);
    setCursors((prevCursors) => {
      const updatedCursors = { ...prevCursors };
      delete updatedCursors[id];
      return updatedCursors;
    });
    // setIsTyping(false);
  };

  const handleTextareaFocus = () => {
    // setIsTyping(true);
  };

  const handleTextareaBlur = () => {
    // setIsTyping(false);
  };

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const handleTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.currentTarget.value);

    e.currentTarget.style.height = "auto";
    e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (showTextarea && isTextValue) {
      console.log(textValue);
      hideTextareaField("cursor");
      setTextValue("");
    }
  };

  return (
    <div>
      {showTextarea && (
        // Object.values(cursors).map((cursor) => (

        // ))
        <div
          className={styles.cursor}
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
          }}
        >
          <form
            className={`${isTextValue ? styles.formActive : ""}`}
            onSubmit={handleSubmit}
          >
            <textarea
              autoFocus={true}
              placeholder="이미지 생성을 위한 메세지를 입력해주세요."
              rows={1}
              cols={40}
              value={textValue}
              onFocus={handleTextareaFocus}
              onBlur={handleTextareaBlur}
              onKeyDown={handleTextareaKeyDown}
              onChange={handleTextareaHeight}
            />
            <input
              className={`${isTextValue ? styles.btnActive : ""}`}
              type="submit"
              value={""}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default CursorChat;
