import { useAgentImageQuery } from "@/libs/api/generate";
import { useState } from "react";
import { TLShapeId } from "tldraw";

export function useImageAgent() {
  const [agentImageRequestData, setAgentImageRequestData] = useState<{
    prompt: string;
    width: number;
    height: number;
    x: number;
    y: number;
    deleteShapeId?: TLShapeId;
  }>({
    prompt: "",
    width: 512,
    height: 512,
    x: 0,
    y: 0,
  });

  const query = useAgentImageQuery({
    name: "generate_image",
    args: {
      prompt: agentImageRequestData.prompt,
      width: agentImageRequestData.width,
      height: agentImageRequestData.height,
    },
  });

  return {
    query,
    agentImageRequestData,
    setAgentImageRequestData,
  };
}
