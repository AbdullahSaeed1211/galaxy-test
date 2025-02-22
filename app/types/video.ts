export interface TransformationParams {
  prompt: string;
  num_inference_steps: number;
  strength: number;
  aspect_ratio: "16:9" | "9:16";
  resolution: "480p" | "580p" | "720p";
  num_frames: 85 | 129;
  pro_mode: boolean;
  enable_safety_checker: boolean;
}

export interface UploadInfo {
  uuid: string;
  cdnUrl?: string;
}

export const DEFAULT_PARAMS: TransformationParams = {
  prompt: "",
  num_inference_steps: 30,
  strength: 0.75,
  aspect_ratio: "16:9",
  resolution: "720p",
  num_frames: 129,
  pro_mode: false,
  enable_safety_checker: true,
};

export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB 