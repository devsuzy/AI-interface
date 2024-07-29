import {
  Excalidraw,
  convertToExcalidrawElements,
} from "@excalidraw/excalidraw";

const ExcalidrawElementData = convertToExcalidrawElements([
  {
    type: "rectangle",
    id: "rectangle-1",
    fillStyle: "hachure",
    strokeWidth: 1,
    strokeStyle: "solid",
    opacity: 100,
    x: 100.50390625,
    y: 93.67578125,
    strokeColor: "#000000",
    backgroundColor: "transparent",
    width: 186.47265625,
    height: 141.9765625,
    angle: 0,
    roundness: null,
    roughness: 1,
    seed: 1968410350,
    version: 141,
    versionNonce: 361174001,
    groupIds: [],
  },
  {
    type: "arrow",
    x: 355,
    y: 279,
    label: {
      text: "HELLO WORLD!!",
    },
    start: {
      id: "rectangle-1",
    },
    end: {
      type: "rectangle",
      strokeWidth: 1,
      strokeStyle: "solid",
      opacity: 100,
      x: 450.50390625,
      y: 393.67578125,
      strokeColor: "#000000",
      backgroundColor: "transparent",
      width: 186.47265625,
      height: 141.9765625,
    },
  },
]);

export default function ExcalidrawContainer() {
  return (
    <>
      <div className="w-full h-full">
        <Excalidraw
          langCode="ko-KR"
          theme="dark"
          initialData={{
            elements: ExcalidrawElementData,
            appState: {},
            scrollToContent: true,
          }}
        />
      </div>
    </>
  );
}
