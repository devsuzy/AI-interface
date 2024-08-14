import { useImageAgent } from "@/hooks/generate/useImageAgent";
import { useImagePlan } from "@/hooks/generate/useImagePlan";
import { useImageUpload } from "@/hooks/generate/useImageUpload";
import { blobToBase64 } from "@/libs/utils/blobToBase64";
import { cursorChatValueState } from "@/stores/cursorChat";
import { isCanvasLoadingState } from "@/stores/tldraw";
import { useChatMessages } from "@chainlit/react-client";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  AssetRecordType,
  TLGeoShape,
  TLImageShape,
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

  const [cursorChatValue, setCursorChatValue] =
    useRecoilState(cursorChatValueState);
  const setIsCanvasLoadingState = useSetRecoilState(isCanvasLoadingState);

  const [content, setContent] = useState<ContentType[]>([]);

  const {
    query: { data: uploadImageData },
    setUploadImageRequestData,
  } = useImageUpload();

  const {
    query: {
      data: planData,
      isLoading: planIsLoading,
      isFetching: planIsFetChing,
    },
    setPlanImageRequestData,
  } = useImagePlan();

  const {
    query: {
      data: agentData,
      isLoading: agentIsLoading,
      isFetching: agentIsFetChing,
    },
    agentImageRequestData,
    setAgentImageRequestData,
  } = useImageAgent();

  const handleResetData = useCallback(() => {
    // prompt 초기화
    setCursorChatValue("");
    // plan Request Data 초기화
    setPlanImageRequestData({ prompt: "", image_path_list: [] });
  }, [setCursorChatValue, setPlanImageRequestData]);

  useEffect(() => {
    if (!planData) return;
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
  }, [planData, editor]);

  useEffect(() => {
    if (!uploadImageData) return;
    setPlanImageRequestData((prev) => ({
      ...prev,
      image_path_list: [uploadImageData.data.uri],
    }));
  }, [uploadImageData, setPlanImageRequestData]);

  // S: Loading 상태 처리
  useEffect(() => {
    if (
      (planIsLoading && planIsFetChing) ||
      (agentIsLoading && agentIsFetChing)
    ) {
      setIsCanvasLoadingState(true);
    }
    if (
      !planIsLoading &&
      !planIsFetChing &&
      !agentIsLoading &&
      !agentIsFetChing
    ) {
      setIsCanvasLoadingState(false);
      handleResetData();
    }
  }, [
    planIsLoading,
    planIsFetChing,
    agentIsLoading,
    agentIsFetChing,
    setIsCanvasLoadingState,
    handleResetData,
  ]);
  // E: Loading 상태 처리

  useEffect(() => {
    if (!cursorChatValue.trim()) return;

    setPlanImageRequestData((prev) => ({
      ...prev,
      prompt: cursorChatValue,
    }));

    const shapes = editor.getSelectedShapes();
    if (shapes.length) {
      if (shapes.length > 1) {
        alert("한 개의 shape을 선택해주세요.");
        return;
      }

      const [shape] = shapes;

      if (shape.type === "image") {
        handleShapePlan(shape as TLImageShape);
      } else if (shape.id.includes("shape:user-rect")) {
        const geoShape = shape as TLGeoShape;
        setAgentImageRequestData({
          prompt: cursorChatValue,
          width: geoShape.props.w,
          height: geoShape.props.h,
          x: geoShape.x,
          y: geoShape.y,
          deleteShapeId: shape.id,
        });
      }
    } else {
      alert("한 개의 shape을 선택해주세요.");
      handleResetData();
      return;
    }

    async function handleShapePlan(shape: TLImageShape) {
      // S: 선택한 image shape의 upload 처리
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
        height: shape.props.h,
        width: shape.props.w,
      });

      const dataUrl = await blobToBase64(blob!);

      setUploadImageRequestData({
        base64: dataUrl.replace("data:image/jpeg;base64,", ""),
        name: `test${uuidv4()}.jpg`,
      });
      // E: 선택한 image shape의 upload 처리
    }
  }, [
    cursorChatValue,
    editor,
    setUploadImageRequestData,
    setPlanImageRequestData,
    setAgentImageRequestData,
    handleResetData,
  ]);

  useEffect(() => {
    if (!agentData || !agentData.data.result.images_list.length) return;

    const imageWidth = agentImageRequestData.width;
    const imageHeight = agentImageRequestData.height;
    const imageX = agentImageRequestData.x;
    const imageY = agentImageRequestData.y;
    const assetId = AssetRecordType.createId();

    editor.createAssets([
      {
        id: assetId,
        type: "image",
        typeName: "asset",
        props: {
          name: "bg_up.jpg",
          src: `data:image/jpeg;base64,${agentData.data.result.images_list[0]}`,
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
      x: imageX,
      y: imageY,
      props: {
        assetId,
        w: imageWidth,
        h: imageHeight,
      },
    });

    if (agentImageRequestData.deleteShapeId) {
      editor.deleteShape(agentImageRequestData.deleteShapeId);
    }

    // editor.selectAll();
    editor.zoomToFit();
  }, [agentData, agentImageRequestData, editor]);

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
