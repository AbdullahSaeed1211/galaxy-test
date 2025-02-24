export interface IVideoTransformation {
  userId: string;
  originalVideo: {
    url: string;
    uploadcareId: string;
    cloudinaryId?: string;
    size?: number;
    format?: string;
  };
  transformedVideo?: {
    url?: string;
    cloudinaryId?: string;
  };
  parameters: {
    prompt: string;
    video_url: string;
    num_inference_steps?: number;
    seed?: number;
    strength?: number;
    aspect_ratio?: '16:9' | '9:16';
    resolution?: '480p' | '580p' | '720p';
    num_frames?: 85 | 129;
    pro_mode?: boolean;
    enable_safety_checker?: boolean;
    requestId?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FalWebhookPayload {
  request_id: string;
  gateway_request_id: string;
  status: 'OK' | 'ERROR';
  error?: string;
  payload?: {
    video: {
      url: string;
      content_type?: string;
      file_name?: string;
      file_size?: number;
    };
    seed?: number;
  };
  payload_error?: string;
} 