import * as falai from '@fal-ai/serverless-client';
import { config } from '@/lib/config';

// Initialize Fal AI client
falai.config({
  credentials: config.falAi.apiKey,
});

export interface TransformationOptions {
  style: string;
  intensity: number;
  additionalParams?: Record<string, unknown>;
}

export const startTransformation = async (
  videoUrl: string,
  options: TransformationOptions,
  transformationId: string
): Promise<void> => {
  try {
    await falai.subscribe(config.falAi.modelId, {
      input: {
        video_url: videoUrl,
        style: options.style,
        intensity: options.intensity,
        ...options.additionalParams,
      },
      onQueueUpdate: (update) => {
        console.log('Queue position:', update.queuePosition);
      },
      onResult: async (result) => {
        // The result handling will be done by the webhook
        console.log('Transformation completed:', result);
      },
      onError: (error) => {
        console.error('Transformation error:', error);
        // Error handling will be done by the webhook
      },
      logs: true,
      webhook: {
        url: `${config.app.url}/api/webhook/fal`,
        headers: {
          'x-transformation-id': transformationId,
        },
      },
    });
  } catch (error) {
    console.error('Error starting transformation:', error);
    throw new Error('Failed to start video transformation');
  }
};

export const getTransformationStyles = () => {
  return config.transformationStyles.map(style => ({
    id: style.id,
    name: style.name,
    description: style.description,
  }));
};

export const validateTransformationOptions = (options: TransformationOptions): boolean => {
  if (options.intensity < 0 || options.intensity > 100) {
    throw new Error('Intensity must be between 0 and 100');
  }

  const validStyles = config.transformationStyles.map(style => style.id);
  if (!validStyles.includes(options.style)) {
    throw new Error(`Style must be one of: ${validStyles.join(', ')}`);
  }

  return true;
}; 