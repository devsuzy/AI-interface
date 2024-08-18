import { useAautoLayoutShape } from "@/hooks/autolayout/useAutoLayoutShape";
import {
  Geometry2d,
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  TLBaseShape,
  TLResizeInfo,
  TLShape,
  resizeBox,
} from "tldraw";

export type MyRectShape = TLBaseShape<
  "my-rect-shape",
  {
    w: number;
    h: number;
  }
>;

const SHAPE_SIZE = 512;
const LIMIT_SIZE = 1334;

export class MyRectShapeUtil extends ShapeUtil<MyRectShape> {
  static override type = "my-rect-shape" as const;

  getDefaultProps(): MyRectShape["props"] {
    return {
      w: SHAPE_SIZE,
      h: SHAPE_SIZE,
    };
  }

  getGeometry(shape: MyRectShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  // override isAspectRatioLocked = () => true;
  // override canBind = () => true;
  // override hideResizeHandles = () => false;
  override canResize = () => true;
  override canEdit = () => false;

  override canDropShapes = (shape: MyRectShape, shapes: TLShape[]) => {
    if (shapes.every((s) => s.type !== "my-rect-shape")) {
      return true;
    }
    return false;
  };

  override onDropShapesOver = (shape: MyRectShape, shapes: TLShape[]) => {
    const rangeX = { start: shape.x, end: shape.x + shape.props.w };
    const rangeY = { start: shape.y, end: shape.y + shape.props.h };
    const pointPos = this.editor.inputs.currentPagePoint;
    if (
      rangeX.start <= pointPos.x &&
      rangeX.end >= pointPos.x &&
      rangeY.start <= pointPos.y &&
      rangeY.end >= pointPos.y
    ) {
      // 대지 위에서 밖으로 빠져나올 때 이벤트 막기
      this.editor
        .getContainer()
        .dispatchEvent(
          new CustomEvent("dropShapesOver", { detail: { shape, shapes } })
        );
    }
  };

  override onDragShapesOver = (shape: MyRectShape, shapes: TLShape[]) => {
    if (!shapes.every((child) => child.parentId === shape.id)) {
      this.editor.reparentShapes(shapes, shape.id);
    }
  };

  override onDragShapesOut = (shape: MyRectShape, shapes: TLShape[]) => {
    this.editor.reparentShapes(shapes, this.editor.getCurrentPageId());
  };

  override onResize = (shape: MyRectShape, info: TLResizeInfo<MyRectShape>) => {
    return resizeBox(shape, info, {
      maxWidth: LIMIT_SIZE,
      maxHeight: LIMIT_SIZE,
    });
  };

  component(shape: MyRectShape) {
    return (
      <HTMLContainer
        style={{
          height: shape.props.h,
          width: shape.props.w,
          maxWidth: LIMIT_SIZE,
          maxHeight: LIMIT_SIZE,
          backgroundColor: "#efefef",
          borderRight: "1px solid #ccc",
          borderBottom: "1px solid #ccc",
        }}
      />
    );
  }

  indicator(shape: MyRectShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
