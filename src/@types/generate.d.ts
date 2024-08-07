import { HttpStatusType } from "@/@types/common";

export interface ImageUploadRequest {
  base64: string;
  name: string;
}
export interface ImageUploadResponse {
  status: HttpStatusType;
  uri: string;
}

export interface ImagePlanRequest {
  prompt: string;
  image_path_list: string[];
}
export interface ImagePlanResponse {
  status: HttpStatusType;
  result: any[];
}

export interface ImageAgentRequest {
  name: string;
  args: { [key in string]: any };
}
export interface ImageAgentResponse {
  status: HttpStatusType;
  result: {
    images_list: string[];
  };
}
