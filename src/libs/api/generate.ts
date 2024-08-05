import {
  ImagePlanRequest,
  ImagePlanResponse,
  ImageUploadRequest,
  ImageUploadResponse,
} from "@/@types/generate";
import { api } from "@/libs/http/http-helper";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export function postUploadImage(
  request: ImageUploadRequest
): Promise<AxiosResponse<ImageUploadResponse>> {
  return api.post("/api/upload", request);
}

export function postPlanImage(
  request: ImagePlanRequest
): Promise<AxiosResponse<ImagePlanResponse>> {
  return api.post("/api/plan", request);
}

export const useUploadImage = (request: ImageUploadRequest) =>
  useQuery({
    queryKey: [],
    queryFn: () => postUploadImage(request),
    staleTime: 0,
    gcTime: 0,
    enabled: request.base64.trim() !== "" && request.name.trim() !== "",
  });

export const usePlanImage = (request: ImagePlanRequest) =>
  useQuery({
    queryKey: [],
    queryFn: () => postPlanImage(request),
    gcTime: 0,
    staleTime: 0,
    enabled: request.prompt.trim() !== "" && request.image_path_list.length > 0,
  });
