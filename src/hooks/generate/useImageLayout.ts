import { ImageAgentLayoutRequest } from "@/@types/generate";
import { useAgentLayoutImageQuery } from "@/libs/api/generate";
import { useState } from "react";

export function useImageLayoutAgent() {
  const [agentImageLayoutRequestData, setAgentImageLayoutRequestData] =
    useState<ImageAgentLayoutRequest>({
      name: "autolayout",
      args: {},
    });

  const query = useAgentLayoutImageQuery({
    name: "autolayout",
    args: {
      width: agentImageLayoutRequestData.args.width,
      height: agentImageLayoutRequestData.args.height,
      objects: agentImageLayoutRequestData.args.objects,
    },
  });

  return {
    query,
    setAgentImageLayoutRequestData,
  };
}
