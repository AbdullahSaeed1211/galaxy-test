'use client';

import { useState } from 'react';
import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';
import { validateVideoFile } from '@/lib/utils/video';
import { getTransformationStyles, validateTransformationOptions } from '@/lib/services/falai';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'react-hot-toast';
import { config } from '@/lib/config';

interface VideoTransformerProps {
  onTransformationStart?: (transformationId: string) => void;
}

export function VideoTransformer({ onTransformationStart }: VideoTransformerProps) {
  const [transforming, setTransforming] = useState(false);
  const [style, setStyle] = useState<string>('anime');
  const [intensity, setIntensity] = useState(50);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const transformationStyles = getTransformationStyles();

  const handleUploadComplete = async (event: { successEntries: Array<{ uuid: string; cdnUrl?: string }> }) => {
    const successFiles = event.successEntries;
    if (!successFiles?.length) return;

    const info = successFiles[0];
    if (!info.uuid) return;

    try {
      setTransforming(true);
      validateTransformationOptions({ style, intensity });

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

      const response = await fetch('/api/video/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl: info.cdnUrl || `https://ucarecdn.com/${info.uuid}/`,
          uploadcareId: info.uuid,
          transformationType: style,
          parameters: {
            intensity,
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
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Transformation Style
        </label>
        <Select value={style} onValueChange={setStyle}>
          <SelectTrigger>
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            {transformationStyles.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Effect Intensity
        </label>
        <Slider
          value={[intensity]}
          onValueChange={(values: number[]) => setIntensity(values[0])}
          min={0}
          max={100}
          step={1}
        />
        <span className="text-sm text-gray-500">{intensity}%</span>
      </div>

      {transforming && (
        <div className="text-center text-sm text-gray-500">
          Starting transformation...
        </div>
      )}
    </div>
  );
} 