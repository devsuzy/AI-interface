import { usePlanImage, useUploadImage } from "@/libs/api/generate";
import { blobToBase64 } from "@/libs/utils/blobToBase64";
import { cursorChatValueState } from "@/stores/cursorChat";
import { isCanvasLoadingState } from "@/stores/tldraw";
import { useChatMessages } from "@chainlit/react-client";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { TLImageShape, getSvgAsImage, track, useEditor } from "tldraw";
import { v4 as uuidv4 } from "uuid";

type ContentType = { type: string; content: string };

const TldrawPrompt = track(() => {
  const editor = useEditor();
  const { messages } = useChatMessages();
  // const { sendMessage, replyMessage, clear } = useChatInteract();

  const cursorChatValue = useRecoilValue(cursorChatValueState);
  const setIsCanvasLoadingState = useSetRecoilState(isCanvasLoadingState);

  const [content, setContent] = useState<ContentType[]>([]);
  const [uploadImageRequestData, setUploadImageRequestData] = useState({
    base64: "",
    name: "",
  });
  const [createPos, setCreatePos] = useState({ x: 0, y: 0 });
  const [imagePathList, setImagePathList] = useState<string[]>([]);

  const { data: uploadImageData } = useUploadImage(uploadImageRequestData);

  const {
    data: planData,
    isLoading: planIsLoading,
    isFetching: planIsFetChing,
  } = usePlanImage({
    prompt: cursorChatValue,
    image_path_list: imagePathList,
  });

  useEffect(() => {
    if (!planData) return;
    console.log("planData", planData);

    const images = planData.data.result.at(-1).images;
    const message = planData.data.result.at(-1).message;

    if (message) {
      editor.createShape({
        type: "geo",
        x: createPos.x + 10,
        y: createPos.y || 0,
        props: {
          text: message,
          color: "blue",
          w: 400,
          h: 400,
          geo: "rectangle",
        },
      });
    }
  }, [planData, createPos]);

  useEffect(() => {
    if (!uploadImageData) return;
    setImagePathList([uploadImageData.data.uri]);
  }, [uploadImageData]);

  useEffect(() => {
    if (planIsLoading && planIsFetChing) {
      setIsCanvasLoadingState(true);
    }
    if (!planIsLoading && !planIsFetChing) {
      setIsCanvasLoadingState(false);
    }
  }, [planIsLoading, planIsFetChing]);

  useEffect(() => {
    if (!cursorChatValue.trim()) return;

    async function handleShapePlan() {
      const shapes = editor.getSelectedShapes();

      if (shapes.length) {
        // console.log("submit value", cursorChatValue, shape);
        const [shape] = shapes;

        const svg = await editor.getSvg(shapes, {
          scale: 1,
          background: true,
        });

        if (!svg) return;

        const svgString = new XMLSerializer().serializeToString(svg);

        const blob = await getSvgAsImage(editor, svgString, {
          type: "jpeg",
          quality: 1,
          scale: 1,
          height: (shape as TLImageShape).props.h,
          width: (shape as TLImageShape).props.w,
        });

        const dataUrl = await blobToBase64(blob!);

        setUploadImageRequestData({
          base64: dataUrl.replace("data:image/jpeg;base64,", ""),
          name: `test${uuidv4()}.jpg`,
        });

        const pageBox = editor.getSelectionPageBounds()!;
        setCreatePos({ x: pageBox.maxX + 60, y: pageBox.minY });
      } else {
        console.log("submit value", cursorChatValue);
      }
    }

    handleShapePlan();
  }, [cursorChatValue]);

  useEffect(() => {
    if (!cursorChatValue.trim()) return;
    // sendMessage({
    //   name: "client",
    //   type: "undefined",
    //   output: "",
    // });
  }, [cursorChatValue]);

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
