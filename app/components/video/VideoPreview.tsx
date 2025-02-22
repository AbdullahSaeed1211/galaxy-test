import { Video } from "lucide-react";

interface VideoPreviewProps {
  previewUrl: string | null;
  processing: boolean;
}

export function VideoPreview({ previewUrl, processing }: VideoPreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Preview</h3>
      {previewUrl ? (
        <div className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-black">
            <video
              src={previewUrl}
              controls
              className="w-full h-full"
              preload="metadata"
            />
          </div>
          <div className="text-sm text-gray-500">
            {processing ? (
              <div className="flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Processing your video...
              </div>
            ) : (
              'Click "Transform Video" to start the transformation process.'
            )}
          </div>
        </div>
      ) : (
        <div className="aspect-video rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 text-center">
          <Video className="h-12 w-12 text-gray-400 mb-4" />
          <h4 className="text-lg font-medium text-gray-900">Ready to Process</h4>
          <p className="mt-2 text-sm text-gray-500">
            Upload a video to begin transformation
          </p>
        </div>
      )}
    </div>
  );
} 