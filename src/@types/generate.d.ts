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

interface ImageLayoutType {
  type: string;
  position_y: number;
  size_width: number;
  position_x: number;
  size_height: number;
}
export interface ImageAgentLayoutRequest {
  name: string;
  args: { [key in string]: any };
}
export interface ImageAgentLayoutResponse {
  status: HttpStatusType;
  result: {
    canvas_top_margin: number;
    canvas_right_margin: number;
    canvas_bottom_margin: number;
    canvas_left_margin: number;
    objects: ImageLayoutType[];
  };
}

export interface ImageAgentAnalyzeRequest {
  name: string;
  args: { [key in string]: any };
}
export interface ImageAgentAnalyzeResponse {
  status: HttpStatusType;
  result: {
    result: string;
    images: string[];
  };
}
