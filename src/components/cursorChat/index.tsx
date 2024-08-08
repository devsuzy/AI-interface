import React, { useState, useEffect, FormEvent } from "react";
import styles from "./styles.module.scss";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  cursorChatValueState,
  cursorChatVisibleState,
} from "@/stores/cursorChat";
import { isCanvasLoadingState } from "@/stores/tldraw";

const CursorChat = () => {
  const isLoading = useRecoilValue(isCanvasLoadingState);
  const [showTextarea, setShowTextarea] = useRecoilState(
    cursorChatVisibleState
  );
  const setCursorChatValue = useSetRecoilState(cursorChatValueState);
  const [textValue, setTextValue] = useState("");
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const isTextValue = textValue.trim().length > 0;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const position = { x: e.clientX, y: e.clientY };
      setMousePosition(position);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowTextarea(false);
        return;
      }
      if (e.key === "/") {
        if (isLoading || showTextarea) return;
        e.preventDefault();
        setShowTextarea(true);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showTextarea, mousePosition]);

  const resetChat = () => {
    setTextValue("");
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

  const handleTextareaBlur = () => {
    resetChat();
  };

  const handleTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.currentTarget.value);

    e.currentTarget.style.height = "auto";
    e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (showTextarea && isTextValue) {
      resetChat();
      setCursorChatValue(textValue);
    }
  };

  return (
    <>
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
    </>
  );
};

export default CursorChat;
