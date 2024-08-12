import { ImagePlanRequest } from "@/@types/generate";
import { usePlanImageQuery } from "@/libs/api/generate";
import { useState } from "react";

export function useImagePlan() {
  const [planImageRequestData, setPlanImageRequestData] =
    useState<ImagePlanRequest>({
      prompt: "",
      image_path_list: [],
    });

  const query = usePlanImageQuery(planImageRequestData);

  return {
    query,
    setPlanImageRequestData,
  };
}
