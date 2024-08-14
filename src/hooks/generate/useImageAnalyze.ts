import { ImageAgentAnalyzeRequest } from "@/@types/generate";
import { useAgentAnalyzeImageQuery } from "@/libs/api/generate";
import { useState } from "react";

export function useImageAnalyzeAgent() {
  const [agentImageAnalyzeRequestData, setAgentImageAnalyzeRequestData] =
    useState<ImageAgentAnalyzeRequest>({
      name: "analyze_image",
      args: {},
    });

  const query = useAgentAnalyzeImageQuery({
    name: "analyze_image",
    args: {
      image_path: agentImageAnalyzeRequestData.args.image_path,
    },
  });

  return {
    query,
    setAgentImageAnalyzeRequestData,
  };
}
