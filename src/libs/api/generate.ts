import {
  ImagePlanRequest,
  ImagePlanResponse,
  ImageUploadRequest,
  ImageUploadResponse,
} from "@/@types/generate";
import { api } from "@/libs/http/http-helper";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

function postUploadImage(
  request: ImageUploadRequest
): Promise<AxiosResponse<ImageUploadResponse>> {
  return api.post("/api/upload", request);
}

function postPlanImage(
  request: ImagePlanRequest
): Promise<AxiosResponse<ImagePlanResponse>> {
  return api.post("/api/plan", request);
}

export const useUploadImage = (request: ImageUploadRequest) =>
  useQuery({
    queryKey: [request.name],
    queryFn: () => postUploadImage(request),
  });

export const usePlanImage = (request: ImagePlanRequest) =>
  useQuery({
    queryKey: [...request.image_path_list],
    queryFn: () => postPlanImage(request),
  });
