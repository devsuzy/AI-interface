import { ImageAgentLayoutRequest } from "@/@types/generate";
import {
  postAgentAnalyzeImage,
  postAgentLayoutImage,
  postUploadImage,
} from "@/libs/api/generate";
import { MyRectShape } from "@/libs/tldraw/RectShapeUtil";
import { blobToBase64 } from "@/libs/utils/blobToBase64";
import { isCanvasLoadingState } from "@/stores/tldraw";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import {
  Editor,
  TLImageShape,
  TLShape,
  TLShapeId,
  getSvgAsImage,
  useEditor,
} from "tldraw";
import { v4 as uuidv4 } from "uuid";

export function useAautoLayoutShape() {
  const setIsCanvasLoadingState = useSetRecoilState(isCanvasLoadingState);
  // console.log("useAutoLayoutShape !!");
  // console.log(editor, shape, shapes);
  const editor = useEditor();
  const editorContainer = editor.getContainer();

  useEffect(() => {
    function handleDropShapesOver(e: any) {
      const { shape, shapes } = e.detail;

      if (!editor && !shape && shapes.length) return;

      handleAutoLayout(shape, shapes);
    }

    editorContainer.addEventListener("dropShapesOver", handleDropShapesOver);

    return () => {
      editorContainer.removeEventListener(
        "dropShapesOver",
        handleDropShapesOver
      );
    };
  }, [editor]);

  async function handleUploadImage(shape: TLShape) {
    try {
      const shapesFirst = shape as TLImageShape;

      const svg = await editor.getSvg([shape], {
        scale: 1,
        background: true,
      });

      if (!svg) return;

      const svgString = new XMLSerializer().serializeToString(svg);

      const blob = await getSvgAsImage(editor, svgString, {
        type: "jpeg",
        quality: 1,
        scale: 1,
        height: shapesFirst.props.h,
        width: shapesFirst.props.w,
      });

      const dataUrl = await blobToBase64(blob!);

      return postUploadImage({
        base64: dataUrl.replace("data:image/jpeg;base64,", ""),
        name: `test${uuidv4()}.jpg`,
      });
    } catch (err) {
      console.log(err);
      setIsCanvasLoadingState(false);
    }
  }

  async function handleAnalyzeImage(shapes: TLShape[]) {
    try {
      const resultData = [];
      const uploadData = [];

      for (let i = 0; i < shapes.length; i++) {
        uploadData.push(await handleUploadImage(shapes[i]));
      }

      if (!uploadData.length) {
        throw "not found uploadData";
      }

      for (let j = 0; j < uploadData.length; j++) {
        resultData.push(
          await postAgentAnalyzeImage({
            name: "analyze_image",
            args: {
              image_path: uploadData[j]!.data?.uri,
            },
          })
        );
      }

      return resultData;
    } catch (err) {
      console.log(err);
      setIsCanvasLoadingState(false);
    }
  }

  async function handleAutoLayout(shape: MyRectShape, shapes: TLShape[]) {
    setIsCanvasLoadingState(true);

    const canvasWidth = shape.props.w;
    const canvasHeight = shape.props.h;
    const objects: { id: TLShapeId; desc: string }[] = [];

    const analyzeData = await handleAnalyzeImage(shapes);

    console.log(analyzeData);

    shapes.forEach((shape, i) => {
      objects.push({
        id: shape.id,
        desc: analyzeData![i].data.result.result,
      });
    });

    objects.forEach((obj) => {
      editor.updateShape<TLImageShape>({
        id: obj.id,
        type: "image",
        x: Math.random() * (canvasWidth / 2),
        y: Math.random() * (canvasHeight / 2),
        props: {
          w: Math.random() * canvasWidth,
          h: Math.random() * canvasHeight,
        },
        parentId: shape.id,
      });
    });

    editor.reparentShapes(shapes, editor.getCurrentPageId());

    setIsCanvasLoadingState(false);

    // const autoLayoutData = await postAgentLayoutImage({
    //   name: "autolayout",
    //   args: {
    //     width: canvasWidth,
    //     height: canvasHeight,
    //     objects: objects,
    //   },
    // });

    // console.log(autoLayoutData);

    // const autoLayoutData = await testLayout();
    // if (!autoLayoutData) return;
    // const newX = autoLayoutData.data.result.canvas_left_margin;
    // const newY = autoLayoutData.data.result.canvas_top_margin;

    // editor.updateShape<TLImageShape>({
    //   id: shapesId,
    //   type: shapesFirst.type,
    //   x: newX,
    //   y: newY,
    // });

    setIsCanvasLoadingState(false);
  }

  function testLayout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            result: {
              canvas_top_margin: 30,
              canvas_right_margin: 0,
              canvas_bottom_margin: 0,
              canvas_left_margin: 30,
              objects: [],
            },
          },
        });
      }, 3000);
    });
  }
}
