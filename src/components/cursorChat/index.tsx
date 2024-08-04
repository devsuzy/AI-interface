import React, { useState, useEffect, FormEvent } from "react";
import styles from "./styles.module.scss";
import { useSetRecoilState } from "recoil";
import { cursorState } from "@/stores/cursorChat";
interface CursorChatProps {
  showTextarea: boolean;
}

const CursorChat = ({ showTextarea }: CursorChatProps) => {
  const setShowTextarea = useSetRecoilState(cursorState);
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
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        if (showTextarea) return;
        e.preventDefault();
        setShowTextarea(true);
      }
    };

    const handleClick = (e: MouseEvent) => {
      hideTextareaField();
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

  const hideTextareaField = () => {
    setShowTextarea(false);
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
      hideTextareaField();
      setTextValue("");
    }
  };

  return (
    <div>
      {showTextarea && (
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
