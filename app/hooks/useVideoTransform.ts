import { useState } from "react";
import { toast } from "react-hot-toast";
import { TransformationParams, UploadInfo, DEFAULT_PARAMS } from "@/types/video";

export const useVideoTransform = () => {
  const [params, setParams] = useState<TransformationParams>(DEFAULT_PARAMS);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadInfo, setUploadInfo] = useState<UploadInfo | null>(null);

  const handleUploadComplete = async (event: {
    successEntries: Array<{ uuid: string; cdnUrl?: string }>;
  }) => {
    try {
      setError(null);

      const successFiles = event.successEntries;
      if (!successFiles?.length) return;

      const info = successFiles[0];
      if (!info.uuid) return;

      const videoUrl = info.cdnUrl || `https://ucarecdn.com/${info.uuid}/`;

      setUploadInfo(info);
      setPreviewUrl(videoUrl);
      toast.success("Video uploaded successfully");
    } catch (err) {
      if (
        err instanceof Error &&
        !err.message.includes("No file uploaded") &&
        !err.message.includes("Upload failed")
      ) {
        setError(err.message);
        toast.error(err.message);
      }
    }
  };

  const handleTransform = async () => {
    if (!uploadInfo) {
      toast.error("Please upload a video first");
      return;
    }

    if (!params.prompt?.trim()) {
      toast.error("Please enter a prompt for the transformation");
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      const videoUrl = uploadInfo.cdnUrl || `https://ucarecdn.com/${uploadInfo.uuid}/`;

      const response = await fetch("/api/video/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceVideoUrl: videoUrl,
          sourceVideoName: uploadInfo.uuid,
          transformationParameters: params,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process video");
      }

      window.location.href = "/history";
      toast.success("Video processing started! Redirecting to history...");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setProcessing(false);
    }
  };

  const handleUploadFailed = (error: { errors: Array<{ message: string }> }) => {
    const errorMessage = error.errors[0]?.message || "Upload failed";
    toast.error(errorMessage);
  };

  return {
    params,
    setParams,
    showAdvanced,
    setShowAdvanced,
    processing,
    error,
    previewUrl,
    uploadInfo,
    handleUploadComplete,
    handleTransform,
    handleUploadFailed,
  };
}; 