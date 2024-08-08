import {
  postAgentImage,
  usePlanImage,
  useUploadImage,
} from "@/libs/api/generate";
import { blobToBase64 } from "@/libs/utils/blobToBase64";
import { cursorChatValueState } from "@/stores/cursorChat";
import { isCanvasLoadingState } from "@/stores/tldraw";
import { useChatMessages } from "@chainlit/react-client";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  AssetRecordType,
  TLImageShape,
  createShapeId,
  getSvgAsImage,
  track,
  useEditor,
} from "tldraw";
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

    const pageBox = editor.getSelectionPageBounds()!;

    if (message) {
      editor.createShape({
        type: "geo",
        x: (pageBox.maxX || 0) + 60,
        y: pageBox.minY || 0,
        props: {
          text: message,
          color: "blue",
          w: 400,
          h: 400,
          geo: "rectangle",
        },
      });
    }
  }, [planData]);

  useEffect(() => {
    if (!uploadImageData) return;
    console.log("uploadImageData", uploadImageData);
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
        // S: 선택한 shape이 있는 경우
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
        // E: 선택한 shape이 있는 경우
      } else {
        // S: 선택한 shape이 없는 경우
        console.log("submit value", cursorChatValue);
        const data = await postAgentImage({
          name: "generate_image",
          args: {
            prompt: cursorChatValue,
            // prompt:
            //   "Lively summer beach scene with golden sand, turquoise waters, and colorful beach umbrellas. People are enjoying sunbathing, swimming, and playing beach volleyball, perfect for a summer vacation ad.",
            width: 512,
            height: 512,
          },
        });
        console.log(data, data.data.result.images_list[0]);

        // const newId = createShapeId(uuidv4());
        // editor.createShape<TLImageShape>({
        //   opacity: 1,
        //   id: newId,
        //   type: "image",
        //   x: 0,
        //   y: 0,
        //   props: {
        //     w: 512,
        //     h: 512,
        //     url: `data:image/jpeg;base64,${data.data.result.images_list[0]}`,
        //     url: "https://mims.kr/hmj/place-512.png",
        //   },
        // });
        // E: 선택한 shape이 없는 경우

        const assetId = AssetRecordType.createId();
        const imageWidth = 512;
        const imageHeight = 512;

        editor.createAssets([
          {
            id: assetId,
            type: "image",
            typeName: "asset",
            props: {
              name: "bg_up.jpg",
              src: `data:image/jpeg;base64,${data.data.result.images_list[0]}`,
              w: imageWidth,
              h: imageHeight,
              mimeType: "image/png",
              isAnimated: false,
            },
            meta: {},
          },
        ]);

        editor.createShape({
          type: "image",
          x: (window.innerWidth - imageWidth) / 2,
          y: (window.innerHeight - imageHeight) / 2,
          props: {
            assetId,
            w: imageWidth,
            h: imageHeight,
          },
        });

        editor.selectAll();
        editor.zoomToFit();
      }
    }

    handleShapePlan();
  }, [cursorChatValue]);

  // useEffect(() => {
  //   if (!cursorChatValue.trim()) return;
  //   sendMessage({
  //     name: "client",
  //     type: "undefined",
  //     output: "",
  //   });
  // }, [cursorChatValue]);

  // useEffect(() => {
  //   if (!messages.length) return;
  //   console.log("change messages", messages, messages.length);
  //   const msgContent = messages
  //     .map((msg) =>
  //       msg.output
  //         .replace(/\[(.*?)\]/g, "$1")
  //         .replace(`'type'`, `"type"`)
  //         .replace(`'text'`, `"text"`)
  //         .replace(`'content'`, `"content"`)
  //     )
  //     .map((msg) => JSON.parse(JSON.parse(JSON.stringify(msg))));

  //   setContent(msgContent);
  // }, [messages]);

  // useEffect(() => {
  //   if (content.length) {
  //     content.forEach((msg) => {
  //       console.log(msg.content);
  //       editor.createShape({
  //         type: "geo",
  //         x: 0,
  //         y: 0,
  //         props: {
  //           text: msg.content,
  //           color: "blue",
  //           w: 400,
  //           h: 400,
  //           geo: "rectangle",
  //         },
  //       });
  //     });
  //   }
  // }, [content, editor]);

  return null;
});

export default TldrawPrompt;
