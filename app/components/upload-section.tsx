"use client"

import { useState } from "react"
import { Video } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Slider } from "@/app/components/ui/slider"
import { FileUploaderRegular } from '@uploadcare/react-uploader/next'
import '@uploadcare/react-uploader/core.css'
import { toast } from 'react-hot-toast'
import { config } from '@/lib/config'

// Custom styles for Uploadcare uploader
const uploaderStyles = `
  .uploadcare--widget__button {
    background: #1a1a1a !important;
    border-radius: 0.5rem !important;
    color: white !important;
    padding: 0.75rem 1rem !important;
    font-weight: 500 !important;
    transition: opacity 0.2s !important;
    display: flex !important;
    align-items: center !important;
    gap: 0.5rem !important;
  }
  .uploadcare--widget__button:hover {
    opacity: 0.9 !important;
  }
  .uploadcare--widget__button_type_open {
    margin: 0 auto !important;
  }
  .uploadcare--widget__button_type_open::before {
    content: "↑" !important;
    font-size: 1.2em !important;
  }
  .uploadcare--tab__content {
    background: white !important;
  }
  .uploadcare--widget__text {
    font-size: 0.875rem !important;
    line-height: 1.25rem !important;
  }
  .uploadcare--powered-by {
    display: none !important;
  }
  .uploadcare--widget {
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
  }
  .uploadcare--widget__button-container {
    display: flex !important;
    justify-content: center !important;
    width: auto !important;
  }
`;

export function UploadSection() {
  const [intensity, setIntensity] = useState([50])
  const [style, setStyle] = useState("anime")
  const [transforming, setTransforming] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleUploadComplete = async (event: { successEntries: Array<{ uuid: string; cdnUrl?: string }> }) => {
    const successFiles = event.successEntries;
    if (!successFiles?.length) return;

    const info = successFiles[0];
    if (!info.uuid) return;

    // Set preview URL
    setPreviewUrl(info.cdnUrl || `https://ucarecdn.com/${info.uuid}/`);
    toast.success('Video uploaded successfully');
  };

  const handleUploadFailed = (error: { errors: Array<{ message: string }> }) => {
    const errorMessage = error.errors[0]?.message || 'Upload failed';
    toast.error(errorMessage);
  };

  const handleTransform = async () => {
    if (!previewUrl) {
      toast.error('Please upload a video first');
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
          transformationType: style,
          parameters: {
            intensity: intensity[0],
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start transformation');
      }

      toast.success('Transformation started successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setTransforming(false);
    }
  };

  return (
    <>
      <style jsx global>{uploaderStyles}</style>
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            {/* Left Column */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Upload Video</h2>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-8 transition-colors hover:bg-gray-50">
                <FileUploaderRegular
                  pubkey={config.uploadcare.publicKey}
                  onChange={handleUploadComplete}
                  onFileUploadFailed={handleUploadFailed}
                  maxLocalFileSizeBytes={100 * 1024 * 1024}
                  sourceList={['local', 'camera', 'url'].join(', ')}
                  className="uc-video-uploader"
                  accept="video/*"
                />
                {!previewUrl && (
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Supported formats: MP4, MOV, AVI, WMV
                    <br />
                    Max file size: 100MB
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="cartoon">Cartoon</SelectItem>
                    <SelectItem value="realistic">Realistic</SelectItem>
                  </SelectContent>
                </Select>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Intensity</label>
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    max={100}
                    step={1}
                    className="[&_[role=slider]]:bg-[#6C5CE7]"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>{intensity}%</span>
                    <span>100%</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-[#6C5CE7] hover:bg-[#6C5CE7]/90"
                  onClick={handleTransform}
                  disabled={!previewUrl || transforming}
                >
                  <Video className="mr-2 h-4 w-4" />
                  {transforming ? 'Transforming...' : 'Transform Video'}
                </Button>
              </div>
            </div>
            {/* Right Column */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-12">
              {previewUrl ? (
                <div className="w-full space-y-4">
                  <h3 className="text-lg font-semibold text-center">Video Preview</h3>
                  <div className="aspect-video rounded-lg overflow-hidden bg-black">
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-full"
                      preload="metadata"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Video className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-semibold">Ready to Process</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Upload a video to begin transformation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

