"use client";

import { useState } from "react";
import { Video, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import { toast } from "react-hot-toast";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import Link from "next/link";
import { TransformationParams, DEFAULT_PARAMS, MAX_VIDEO_SIZE } from "@/types/video";
import { Card } from "./ui/card";

export function UploadSection() {
  const [params, setParams] = useState<TransformationParams>(DEFAULT_PARAMS);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadInfo, setUploadInfo] = useState<{
    uuid: string;
    cdnUrl?: string;
  } | null>(null);

  const handleUploadComplete = async (event: {
    successEntries: Array<{ uuid: string; cdnUrl?: string }>;
  }) => {
    try {
      setError(null);

      const successFiles = event.successEntries;
      if (!successFiles?.length) {
        return; // Silent return for no files, don't show error
      }

      const info = successFiles[0];
      if (!info.uuid) {
        return; // Silent return for no UUID, don't show error
      }

      // Get the CDN URL, either directly or construct it from UUID
      const videoUrl = info.cdnUrl || `https://ucarecdn.com/${info.uuid}/`;

      // Store upload info for later transformation
      setUploadInfo(info);
      // Set preview URL immediately
      setPreviewUrl(videoUrl);

      // Only show success toast when everything is complete
      toast.success("Video uploaded successfully");
    } catch (err) {
      // Only show error toast for actual errors, not during normal upload process
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

      const videoUrl =
        uploadInfo.cdnUrl || `https://ucarecdn.com/${uploadInfo.uuid}/`;

      const response = await fetch("/api/video/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      // const data = await response.json();

      // Redirect to history page after successful processing start
      window.location.href = "/history";

      toast.success("Video processing started! Redirecting to history...");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setProcessing(false);
    }
  };

  const handleUploadFailed = (error: {
    errors: Array<{ message: string }>;
  }) => {
    const errorMessage = error.errors[0]?.message || "Upload failed";
    toast.error(errorMessage);
  };

  return (
    <section className="py-6 bg-white" id="upload">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">

          <div className="grid md:grid-cols-5 gap-6">
            {/* Left Column - Upload and Parameters */}
            <Card className="bg-white rounded-lg shadow-sm p-6 md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Upload Video</h2>
              <div className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}

                <div className="border rounded-lg p-8 border-dashed flex flex-col items-center justify-center">
                  <FileUploaderRegular
                    pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || ''}
                    onChange={handleUploadComplete}
                    onFileUploadFailed={handleUploadFailed}
                    maxLocalFileSizeBytes={MAX_VIDEO_SIZE}
                    multiple={false}
                    sourceList={["local", "camera", "url"].join(", ")}
                    className="uc-video-uploader"
                    accept="video/*"
                    classNameUploader="uc-light"
                  />
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Supported formats: MP4, MOV, AVI, WMV
                    <br />
                    Max file size: 100MB
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Prompt <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={params.prompt}
                      onChange={(e) => {
                        setParams({ ...params, prompt: e.target.value });
                        setError(null); // Clear error when typing
                      }}
                      placeholder="Describe the style transformation..."
                      className={`w-full ${
                        error && !params.prompt?.trim()
                          ? "border-red-300"
                          : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Resolution
                    </label>
                    <Select
                      value={params.resolution}
                      onValueChange={(value: "480p" | "580p" | "720p") =>
                        setParams({ ...params, resolution: value })
                      }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="480p">480p (Faster)</SelectItem>
                        <SelectItem value="580p">580p (Balanced)</SelectItem>
                        <SelectItem value="720p">
                          720p (Higher Quality)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Aspect Ratio
                    </label>
                    <Select
                      value={params.aspect_ratio}
                      onValueChange={(value: "16:9" | "9:16") =>
                        setParams({ ...params, aspect_ratio: value })
                      }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                        <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2">
                    Advanced Settings
                    {showAdvanced ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  {showAdvanced && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Number of Frames
                        </label>
                        <Select
                          value={params.num_frames.toString()}
                          onValueChange={(value) =>
                            setParams({
                              ...params,
                              num_frames: parseInt(value) as 85 | 129,
                            })
                          }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="85">
                              85 frames (Faster)
                            </SelectItem>
                            <SelectItem value="129">
                              129 frames (Better Quality)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Inference Steps: {params.num_inference_steps}
                        </label>
                        <Input
                          type="number"
                          value={params.num_inference_steps}
                          onChange={(e) =>
                            setParams({
                              ...params,
                              num_inference_steps: parseInt(e.target.value),
                            })
                          }
                          min={10}
                          max={50}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Range: 10-50. Higher values = better quality but
                          slower
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Transformation Strength:{" "}
                          {Math.round(params.strength * 100)}%
                        </label>
                        <Input
                          type="number"
                          value={Math.round(params.strength * 100)}
                          onChange={(e) =>
                            setParams({
                              ...params,
                              strength: parseInt(e.target.value) / 100,
                            })
                          }
                          min={1}
                          max={100}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Controls how much the original video is transformed
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium">
                            Pro Mode
                          </label>
                          <p className="text-xs text-gray-500">
                            55 steps, higher quality, 2x cost
                          </p>
                        </div>
                        <Switch
                          checked={params.pro_mode}
                          onCheckedChange={(checked) =>
                            setParams({ ...params, pro_mode: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium">
                            Safety Checker
                          </label>
                          <p className="text-xs text-gray-500">
                            Filter inappropriate content
                          </p>
                        </div>
                        <Switch
                          checked={params.enable_safety_checker}
                          onCheckedChange={(checked) =>
                            setParams({
                              ...params,
                              enable_safety_checker: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => {
                      if (!uploadInfo) {
                        toast.error("Please upload a video first");
                        return;
                      }
                      if (!params.prompt?.trim()) {
                        setError(
                          "Please enter a prompt for the transformation"
                        );
                        return;
                      }
                      handleTransform();
                    }}
                    disabled={processing || !uploadInfo}
                    className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium py-3 rounded-md flex items-center justify-center gap-2">
                    <Video className="w-5 h-5" />
                    {processing ? "Processing..." : "Transform Video"}
                  </Button>

                  {processing && (
                    <div className="mt-4 text-center space-y-4">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-800 font-medium mb-2">
                          Your video is being processed
                        </p>
                        <p className="text-sm text-purple-600">
                          This typically takes 3-5 minutes. You can check the
                          status in your history.
                        </p>
                      </div>
                      <Link
                        href="/history"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED] bg-white border border-[#8B5CF6] rounded-md hover:bg-purple-50 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                        View Status in History
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Right Column - Preview */}
            <Card className="bg-white rounded-lg md:col-span-3 shadow-sm p-6">
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
                <div className="aspect-video rounded-lg flex flex-col items-center justify-center p-6 text-center">
                  <Video className="h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900">
                    Ready to Process
                  </h4>
                  <p className="mt-2 text-sm text-gray-500">
                    Upload a video to begin transformation
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
