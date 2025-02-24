import { fal } from '@fal-ai/client';

// Initialize Fal AI client
fal.config({
  credentials: process.env.FAL_AI_API_KEY,
});

// Based on Hunyuan Video API documentation
interface TransformParams {
  prompt: string;
  video_url: string;
  num_inference_steps?: number; // Default: 30
  seed?: number;
  strength?: number; // Default: 0.85
  aspect_ratio?: '16:9' | '9:16'; // Default: "16:9"
  resolution?: '480p' | '580p' | '720p'; // Default: "720p"
  num_frames?: 85 | 129; // Default: 129
  pro_mode?: boolean;
  enable_safety_checker?: boolean;
}

interface TransformResult {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  seed?: number;
}

interface FalApiError extends Error {
  status?: number;
  body?: unknown;
}

export async function transformVideo(params: TransformParams): Promise<TransformResult> {
  try {
    const result = await fal.subscribe("fal-ai/hunyuan-video/video-to-video", {
      input: params,
    });

    if (!result?.data?.video?.url) {
      throw new Error('Failed to process video');
    }

    return result.data;
  } catch (error) {
    console.error('Error in transformVideo:', error);
    throw error;
  }
}

export async function queueVideoTransformation(params: TransformParams, transformationId: string): Promise<string> {
  try {
    // Validate required parameters
    if (!params.prompt || !params.video_url) {
      throw new Error('Missing required parameters: prompt and video_url are required');
    }

    // Construct webhook URL properly, handling any trailing slashes
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, '') || ''; // Remove trailing slashes
    const webhookUrl = `${baseUrl}/api/webhook/fal?transformationId=${transformationId}`;

    // Log the input parameters for debugging
    console.log('Attempting to queue video transformation with params:', {
      params,
      transformationId,
      webhookUrl,
    });

    // Submit to Fal AI queue with webhook pointing to our production endpoint
    const { request_id } = await fal.queue.submit("fal-ai/hunyuan-video/video-to-video", {
      input: params,
      webhookUrl,
    });
    
    console.log('Successfully queued video transformation:', { 
      transformationId, 
      requestId: request_id,
      webhookUrl,
    });
    
    return request_id;
  } catch (error) {
    // Log detailed error information
    const apiError = error as FalApiError;
    console.error('Error queueing video transformation:', {
      error: apiError.message,
      status: apiError.status,
      body: apiError.body,
      params,
      transformationId,
    });
    throw error;
  }
}

export async function getTransformationStatus(requestId: string) {
  try {
    return await fal.queue.status("fal-ai/hunyuan-video/video-to-video", {
      requestId,
      logs: true,
    });
  } catch (error) {
    console.error('Error getting transformation status:', error);
    throw error;
  }
}

export async function getTransformationResult(requestId: string): Promise<TransformResult> {
  try {
    const result = await fal.queue.result("fal-ai/hunyuan-video/video-to-video", {
      requestId,
    });
    return result.data;
  } catch (error) {
    console.error('Error getting transformation result:', error);
    throw error;
  }
} 