'use client';

import { useState } from 'react';
import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';
import { validateVideoFile } from '@/lib/utils/video';
import { toast } from 'react-hot-toast';
import { config } from '@/lib/config';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

interface VideoTransformerProps {
  onTransformationStart?: (transformationId: string) => void;
}

export function VideoTransformer({ onTransformationStart }: VideoTransformerProps) {
  const [transforming, setTransforming] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleUploadComplete = async (event: { successEntries: Array<{ uuid: string; cdnUrl?: string }> }) => {
    const successFiles = event.successEntries;
    if (!successFiles?.length) return;

    const info = successFiles[0];
    if (!info.uuid) return;

    try {
      // Get file info from Uploadcare
      const fileInfoResponse = await fetch(`https://api.uploadcare.com/info/${info.uuid}/`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Uploadcare.Simple ${config.uploadcare.publicKey}:${config.uploadcare.secretKey}`
        }
      });

      if (!fileInfoResponse.ok) {
        throw new Error('Failed to get file info');
      }

      const fileInfo = await fileInfoResponse.json();
      const file = {
        name: fileInfo.original_filename,
        size: fileInfo.size,
      };

      // Validate file
      validateVideoFile(file as File);

      // Set preview URL
      setPreviewUrl(info.cdnUrl || `https://ucarecdn.com/${info.uuid}/`);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const handleTransform = async () => {
    if (!previewUrl) {
      toast.error('Please upload a video first');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a transformation prompt');
      return;
    }

    try {
      setTransforming(true);

      const response = await fetch('/api/video/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl: previewUrl,
          transformationParameters: {
            prompt,
            video_url: previewUrl,
            num_inference_steps: 30,
            strength: 0.85,
            aspect_ratio: '16:9',
            resolution: '720p',
            num_frames: 129,
            enable_safety_checker: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start transformation');
      }

      const { transformationId } = await response.json();
      onTransformationStart?.(transformationId);
      toast.success('Transformation started successfully');

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setTransforming(false);
    }
  };

  const handleUploadFailed = (error: { errors: Array<{ message: string }> }) => {
    const errorMessage = error.errors[0]?.message || 'Upload failed';
    toast.error(errorMessage);
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Upload Video
        </label>
        <FileUploaderRegular
          pubkey={config.uploadcare.publicKey}
          onChange={handleUploadComplete}
          onFileUploadFailed={handleUploadFailed}
          maxLocalFileSizeBytes={100 * 1024 * 1024} // 100MB max
          sourceList={['local', 'camera', 'url'].join(', ')}
          className="uc-video-uploader"
        />
      </div>

      {previewUrl && (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Video Preview
            </label>
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <video
                src={previewUrl}
                controls
                className="w-full h-full"
                preload="metadata"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Transformation Prompt
            </label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe how you want to transform the video..."
              className="w-full"
            />
          </div>

          <Button
            onClick={handleTransform}
            disabled={transforming || !prompt.trim()}
            className="w-full"
          >
            {transforming ? 'Starting transformation...' : 'Transform Video'}
          </Button>
        </>
      )}
    </div>
  );
} 