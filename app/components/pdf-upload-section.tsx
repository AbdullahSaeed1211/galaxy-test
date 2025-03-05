"use client";

import { useState } from "react";
import { FileText, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
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
import { PdfProcessingParams, DEFAULT_PARAMS, MAX_PDF_SIZE } from "@/types/pdf";
import { Card } from "./ui/card";

export function PdfUploadSection() {
  const [params, setParams] = useState<PdfProcessingParams>(DEFAULT_PARAMS);
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
    if (event.successEntries.length > 0) {
      const { uuid, cdnUrl } = event.successEntries[0];
      setUploadInfo({ uuid, cdnUrl });
      toast.success("PDF uploaded successfully!");
    }
  };

  const handleProcess = async () => {
    if (!uploadInfo) {
      toast.error("Please upload a PDF first");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // This would be replaced with actual API call to process the PDF
      toast.success("PDF processing started");
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Set a mock preview URL for demonstration
      setPreviewUrl(`https://example.com/processed/${uploadInfo.uuid}.pdf`);
      toast.success("PDF processed successfully!");
    } catch (err) {
      console.error("Error processing PDF:", err);
      setError("Failed to process PDF. Please try again.");
      toast.error("Failed to process PDF");
    } finally {
      setProcessing(false);
    }
  };

  const handleUploadFailed = (error: {
    errors: Array<{ message: string }>;
  }) => {
    console.error("Upload failed:", error);
    const errorMessage = error.errors[0]?.message || "Upload failed";
    setError(errorMessage);
    toast.error(errorMessage);
  };

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-4">Upload Your PDF</h2>
            <div className="mb-6">
              <FileUploaderRegular
                publicKey="demopublickey" // Replace with your Uploadcare public key
                onChange={handleUploadComplete}
                onWarning={console.log}
                onError={handleUploadFailed}
                maxFileSizeBytes={MAX_PDF_SIZE}
                acceptedFileTypes={[".pdf"]}
                className="w-full"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Select Operation
              </label>
              <Select
                value={params.operation}
                onValueChange={(value) =>
                  setParams({ ...params, operation: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compress">Compress PDF</SelectItem>
                  <SelectItem value="convert">Convert PDF</SelectItem>
                  <SelectItem value="merge">Merge PDFs</SelectItem>
                  <SelectItem value="split">Split PDF</SelectItem>
                  <SelectItem value="encrypt">Encrypt PDF</SelectItem>
                  <SelectItem value="sign">Sign PDF</SelectItem>
                  <SelectItem value="ai-chat">Chat with PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-sm text-blue-600"
              >
                {showAdvanced ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" /> Hide Advanced Options
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" /> Show Advanced
                    Options
                  </>
                )}
              </button>
            </div>

            {showAdvanced && (
              <div className="space-y-4 mb-6">
                {params.operation === "compress" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Quality (%)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={params.quality}
                      onChange={(e) =>
                        setParams({
                          ...params,
                          quality: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                )}

                {(params.operation === "encrypt" || params.operation === "sign") && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <Input
                      type="password"
                      value={params.password}
                      onChange={(e) =>
                        setParams({ ...params, password: e.target.value })
                      }
                    />
                  </div>
                )}

                {params.operation === "convert" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Target Format
                    </label>
                    <Select
                      value={params.targetFormat}
                      onValueChange={(value) =>
                        setParams({ ...params, targetFormat: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="docx">Word (DOCX)</SelectItem>
                        <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                        <SelectItem value="jpg">Image (JPG)</SelectItem>
                        <SelectItem value="png">Image (PNG)</SelectItem>
                        <SelectItem value="txt">Text (TXT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {params.operation === "split" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Page Range
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., 1-5, 8, 11-13"
                      value={params.pageRange}
                      onChange={(e) =>
                        setParams({ ...params, pageRange: e.target.value })
                      }
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="ocr"
                    checked={params.enableOcr}
                    onCheckedChange={(checked) =>
                      setParams({ ...params, enableOcr: checked })
                    }
                  />
                  <label htmlFor="ocr" className="text-sm font-medium">
                    Enable OCR (for scanned documents)
                  </label>
                </div>
              </div>
            )}

            <Button
              onClick={handleProcess}
              disabled={!uploadInfo || processing}
              className="w-full"
            >
              {processing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              {processing ? "Processing..." : "Process PDF"}
            </Button>

            {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
          </Card>

          {/* Preview Section */}
          <Card className="p-6 shadow-md flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-4">Preview</h2>
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              {uploadInfo ? (
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto text-blue-500" />
                  <p className="mt-2 font-medium">
                    {uploadInfo.cdnUrl?.split("/").pop() || "Uploaded PDF"}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">Upload a PDF to see preview</p>
              )}
            </div>

            {previewUrl && (
              <div className="w-full">
                <Button
                  asChild
                  className="w-full"
                  variant="outline"
                >
                  <Link href={previewUrl} target="_blank">
                    Download Processed PDF
                  </Link>
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
} 