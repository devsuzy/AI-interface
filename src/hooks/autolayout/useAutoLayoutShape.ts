import {
  postAgentAnalyzeImage,
  postAgentLayoutImage,
  postUploadImage,
} from "@/libs/api/generate";
import { MyRectShape } from "@/libs/tldraw/RectShapeUtil";
import { blobToBase64 } from "@/libs/utils/blobToBase64";
import { Editor, TLImageShape, TLShape, getSvgAsImage } from "tldraw";
import { v4 as uuidv4 } from "uuid";

export function useAautoLayoutShape({
  editor,
  shape,
  shapes,
}: {
  editor: Editor;
  shape: MyRectShape;
  shapes: TLShape[];
}) {
  // console.log("useAutoLayoutShape !!");
  // console.log(editor, shape, shapes);

  if (!editor && !shape && shapes.length) return;

  const canvasWidth = shape.props.w;
  const canvasHeight = shape.props.h;

  const shapesFirst = shapes[0] as TLImageShape;
  const shapesId = shapesFirst.id;

  async function handleUploadImage() {
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
      height: shapesFirst.props.h,
      width: shapesFirst.props.w,
    });

    const dataUrl = await blobToBase64(blob!);

    return postUploadImage({
      base64: dataUrl.replace("data:image/jpeg;base64,", ""),
      name: `test${uuidv4()}.jpg`,
    });
  }

  async function handleAnalyzeImage() {
    const data = await handleUploadImage();
    return postAgentAnalyzeImage({
      name: "analyze_image",
      args: {
        image_path: data?.data.uri,
      },
    });
  }

  async function handleAutoLayout() {
    // const analyzeData = await handleAnalyzeImage();

    // const autoLayoutData = await postAgentLayoutImage({
    //   name: "autolayout",
    //   args: {
    //     width: canvasWidth,
    //     height: canvasHeight,
    //     objects: [
    //       {
    //         id: shapesId,
    //         desc: analyzeData?.data.result.result,
    //       },
    //     ],
    //   },
    // });

    // console.log(autoLayoutData);

    const autoLayoutData = await testLayout();
    if (!autoLayoutData) return;
    const newX = autoLayoutData.data.result.canvas_left_margin;
    const newY = autoLayoutData.data.result.canvas_top_margin;

    editor.updateShape<TLImageShape>({
      id: shapesId,
      type: shapesFirst.type,
      x: newX,
      y: newY,
    });
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

  handleAutoLayout();
}
