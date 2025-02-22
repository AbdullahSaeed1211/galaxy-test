'use client';

import { useState } from 'react';
import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import type { OutputCollectionState, OutputCollectionStatus } from '@uploadcare/react-uploader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Slider } from '@/app/components/ui/slider';
import { toast } from 'react-hot-toast';

// const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/mov', 'video/avi', 'video/wmv'];
// const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

interface TransformationParams {
  prompt: string;
  num_inference_steps: number;
  seed?: number;
  pro_mode: boolean;
  aspect_ratio: '16:9' | '9:16';
  resolution: '480p' | '580p' | '720p';
  num_frames: 129 | 85;
  enable_safety_checker: boolean;
  strength: number;
}

const defaultParams: TransformationParams = {
  prompt: '',
  num_inference_steps: 30,
  pro_mode: false,
  aspect_ratio: '16:9',
  resolution: '720p',
  num_frames: 129,
  enable_safety_checker: true,
  strength: 0.85,
};

export default function VideoTransformForm() {
  const [params, setParams] = useState<TransformationParams>(defaultParams);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = async (event: OutputCollectionState<OutputCollectionStatus, "maybe-has-group">) => {
    try {
      setUploading(true);
      setError(null);

      if (!event.successEntries.length) {
        throw new Error('No file uploaded');
      }

      const fileInfo = event.successEntries[0];

      // Start processing
      setProcessing(true);
      const response = await fetch('/api/video/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceVideoUrl: fileInfo.cdnUrl,
          sourceVideoName: fileInfo.name,
          transformationParameters: params,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process video');
      }

      toast.success('Video processing started! Check history for updates.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Prompt</label>
          <textarea
            value={params.prompt}
            onChange={(e) => setParams({ ...params, prompt: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
            placeholder="Describe the style or transformation you want to apply..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Resolution</label>
          <Select
            value={params.resolution}
            onValueChange={(value: '480p' | '580p' | '720p') =>
              setParams({ ...params, resolution: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="480p">480p</SelectItem>
              <SelectItem value="580p">580p</SelectItem>
              <SelectItem value="720p">720p</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
          <Select
            value={params.aspect_ratio}
            onValueChange={(value: '16:9' | '9:16') =>
              setParams({ ...params, aspect_ratio: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
              <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Number of Frames</label>
          <Select
            value={params.num_frames.toString()}
            onValueChange={(value) =>
              setParams({ ...params, num_frames: parseInt(value) as 85 | 129 })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="85">85 frames (Faster)</SelectItem>
              <SelectItem value="129">129 frames (Better quality)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Inference Steps: {params.num_inference_steps}
          </label>
          <Slider
            value={[params.num_inference_steps]}
            onValueChange={([value]) =>
              setParams({ ...params, num_inference_steps: value })
            }
            min={10}
            max={50}
            step={1}
          />
          <p className="text-xs text-gray-500 mt-1">
            Higher values produce better quality but take longer to process
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Transformation Strength: {params.strength}
          </label>
          <Slider
            value={[params.strength]}
            onValueChange={([value]) => setParams({ ...params, strength: value })}
            min={0.1}
            max={1}
            step={0.05}
          />
          <p className="text-xs text-gray-500 mt-1">
            Controls how much the original video is transformed
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="pro_mode"
            checked={params.pro_mode}
            onChange={(e) => setParams({ ...params, pro_mode: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="pro_mode" className="text-sm">
            Pro Mode (55 steps, higher quality, 2x cost)
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="safety_checker"
            checked={params.enable_safety_checker}
            onChange={(e) =>
              setParams({ ...params, enable_safety_checker: e.target.checked })
            }
            className="rounded border-gray-300"
          />
          <label htmlFor="safety_checker" className="text-sm">
            Enable Safety Checker
          </label>
        </div>
      </div>

      <div className="border-t pt-6">
        {!uploading && !processing && (
          <FileUploaderRegular
            pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || ''}
            onChange={handleUploadComplete}
            accept="video/*"
          />
        )}
        <p className="text-xs text-gray-500 mt-2">
          Supported formats: MP4, MOV, AVI, WMV. Maximum size: 100MB
        </p>
      </div>

      {(uploading || processing) && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">
            {uploading ? 'Uploading...' : 'Processing...'}
          </span>
        </div>
      )}
    </div>
  );
} 