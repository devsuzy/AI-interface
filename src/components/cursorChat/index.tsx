import React, { useState, useEffect, useRef, FormEvent } from "react";
import styles from "./styles.module.scss";

interface Cursor {
  id: string;
  x: number;
  y: number;
}
interface PropsType {
  showTextarea: boolean;
  setShowTextarea: React.Dispatch<React.SetStateAction<boolean>>;
}

const CursorChat: React.FC<PropsType> = ({ showTextarea, setShowTextarea }) => {
  const [cursors, setCursors] = useState<{ [key: string]: Cursor }>({});
  const [isTyping, setIsTyping] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [btnIsActive, setBtnIsActive] = useState(false);
  const [formIsActive, setFormIsActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const position = { x: e.clientX, y: e.clientY };
      setMousePosition(position);
      updateCursor("cursor", position);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        setIsTyping(true);
        setShowTextarea(true);
        setBtnIsActive(false);
        setFormIsActive(false);
        showTextareaField("cursor", mousePosition);
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
  }, [isTyping, showTextarea, mousePosition]);

  const updateCursor = (id: string, position: { x: number; y: number }) => {
    setCursors((prevCursors) => ({
      ...prevCursors,
      [id]: { id, x: position.x, y: position.y },
    }));
  };

  const showTextareaField = (
    id: string,
    position: { x: number; y: number }
  ) => {
    if (!cursors[id]) {
      setCursors((prevCursors) => ({
        ...prevCursors,
        [id]: { id, x: position.x, y: position.y },
      }));
    }
  };

  const hideTextareaField = (id: string) => {
    setShowTextarea(false);
    setCursors((prevCursors) => {
      const updatedCursors = { ...prevCursors };
      delete updatedCursors[id];
      return updatedCursors;
    });
    setIsTyping(false);
  };

  const handleTextareaFocus = () => {
    setIsTyping(true);
  };

  const handleTextareaBlur = () => {
    setIsTyping(false);
  };

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    if (target.value.length > 0) {
      setBtnIsActive(true);
      setFormIsActive(true);
    } else {
      setBtnIsActive(false);
      setFormIsActive(false);
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const handleTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const textarea = textareaRef.current;
    if (textarea && textarea.value.trim()) {
      console.log(textarea.value);
      hideTextareaField("cursor");
    }
  };

  return (
    <div>
      {showTextarea &&
        Object.values(cursors).map((cursor) => (
          <div
            key={cursor.id}
            className={styles.cursor}
            style={{ left: `${cursor.x}px`, top: `${cursor.y}px` }}
          >
            <form
              className={`${formIsActive ? styles.formActive : ""}`}
              onSubmit={handleSubmit}
            >
              <textarea
                autoFocus={true}
                ref={textareaRef}
                placeholder="이미지 생성을 위한 메세지를 입력해주세요."
                rows={1}
                cols={40}
                onFocus={handleTextareaFocus}
                onBlur={handleTextareaBlur}
                onKeyDown={handleTextareaKeyDown}
                onChange={handleTextareaHeight}
              />
              <input
                className={`${btnIsActive ? styles.btnActive : ""}`}
                type="submit"
                value=""
              />
            </form>
          </div>
        ))}
    </div>
  );
};

export default CursorChat;
