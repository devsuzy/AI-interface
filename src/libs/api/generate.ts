import {
  ImageAgentRequest,
  ImageAgentResponse,
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

export function postAgentImage(
  request: ImageAgentRequest
): Promise<AxiosResponse<ImageAgentResponse>> {
  return api.post("/api/agent", request);
}

export const useUploadImage = (request: ImageUploadRequest) =>
  useQuery({
    queryKey: [request.name],
    queryFn: () => postUploadImage(request),
    staleTime: 0,
    gcTime: 0,
    enabled: request.base64.trim() !== "" && request.name.trim() !== "",
    placeholderData: undefined,
  });

export const usePlanImage = (request: ImagePlanRequest) =>
  useQuery({
    queryKey: [...request.image_path_list],
    queryFn: () => postPlanImage(request),
    gcTime: 0,
    staleTime: 0,
    enabled: request.prompt.trim() !== "" && request.image_path_list.length > 0,
    placeholderData: undefined,
  });

export const useAgentImage = (request: ImageAgentRequest) =>
  useQuery({
    queryKey: [request.name, request.args],
    queryFn: () => postAgentImage(request),
    gcTime: 0,
    staleTime: 0,
    enabled: request.name.trim() !== "" && Object.keys(request.args).length > 0,
    placeholderData: undefined,
  });
