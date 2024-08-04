import { cursorChatValueState } from "@/stores/cursorChat";
import { useChatInteract, useChatMessages } from "@chainlit/react-client";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { track, useEditor } from "tldraw";

type ContentType = { type: string; content: string };

const TldrawPrompt = track(() => {
  const editor = useEditor();
  const { messages } = useChatMessages();
  const { sendMessage, replyMessage, clear } = useChatInteract();

  const cursorChatValue = useRecoilValue(cursorChatValueState);

  const [content, setContent] = useState<ContentType[]>([]);

  useEffect(() => {
    if (!cursorChatValue.trim()) return;
    sendMessage({
      name: "client",
      type: "undefined",
      output: "",
    });
  }, [cursorChatValue, sendMessage]);

  useEffect(() => {
    if (!messages.length) return;
    console.log("change messages", messages, messages.length);
    const msgContent = messages
      .map((msg) =>
        msg.output
          .replace(/\[(.*?)\]/g, "$1")
          .replace(`'type'`, `"type"`)
          .replace(`'text'`, `"text"`)
          .replace(`'content'`, `"content"`)
      )
      .map((msg) => JSON.parse(JSON.parse(JSON.stringify(msg))));

    setContent(msgContent);
  }, [messages]);

  useEffect(() => {
    if (content.length) {
      content.forEach((msg) => {
        console.log(msg.content);
        editor.createShape({
          type: "geo",
          x: 0,
          y: 0,
          props: {
            text: msg.content,
            color: "blue",
            w: 400,
            h: 400,
            geo: "rectangle",
          },
        });
      });
    }
  }, [content, editor]);

  return null;
});

export default TldrawPrompt;
