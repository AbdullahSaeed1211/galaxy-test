'use client';

import { useEffect, useState } from 'react';
import { VideoProcessing } from '@/lib/models/video';
import { Button } from '@/app/components/ui/button';
import { formatDistanceToNow, format } from 'date-fns';
import { RefreshCw, Download, Video, Clock } from 'lucide-react';
import Link from 'next/link';

interface VideoHistoryItem extends VideoProcessing {
  _id: string;
}

interface HistoryResponse {
  records: VideoHistoryItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export default function HistoryPage() {
  const [history, setHistory] = useState<VideoHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/video/history');
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data: HistoryResponse = await response.json();
      setHistory(data.records || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusBadge = (item: VideoHistoryItem) => {
    // If we have a transformed URL, always show completed
    if (item.transformedVideoUrl) {
      return (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          Completed
        </span>
      );
    }

    switch (item.status) {
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            Failed
          </span>
        );
      case 'processing':
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <RefreshCw className="h-3 w-3 inline mr-1 animate-spin" />
            Processing
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Processing History</h1>
          </div>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white shadow rounded-lg p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Processing History</h1>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              Last updated: {format(lastUpdated, 'h:mm:ss a')}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={fetchHistory} 
              disabled={refreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Check Status'}
            </Button>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchHistory} className="mt-4">
              Retry
            </Button>
          </div>
        ) : Array.isArray(history) && history.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Processing History</h3>
            <p className="mt-2 text-sm text-gray-500">
              Videos you process will appear here
            </p>
            <Link 
              href="/"
              className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED] bg-white border border-[#8B5CF6] rounded-md hover:bg-purple-50 transition-colors"
            >
              Transform a Video
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{item.sourceVideoName}</h3>
                      <p className="text-sm text-gray-500">
                        Processed {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {getStatusBadge(item)}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Source Video */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Source Video</h4>
                      <div className="aspect-video rounded-lg overflow-hidden bg-black">
                        <video
                          src={item.sourceVideoUrl}
                          controls
                          className="w-full h-full"
                          preload="metadata"
                        />
                      </div>
                    </div>

                    {/* Transformed Video */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Transformed Video</h4>
                      {item.transformedVideoUrl ? (
                        <div className="space-y-2">
                          <div className="aspect-video rounded-lg overflow-hidden bg-black">
                            <video
                              src={item.transformedVideoUrl}
                              controls
                              className="w-full h-full"
                              preload="metadata"
                            />
                          </div>
                          <a
                            href={item.transformedVideoUrl}
                            download
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download Video
                          </a>
                        </div>
                      ) : (
                        <div className="aspect-video rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
                          {item.status === 'processing' ? (
                            <div className="text-center text-gray-500">
                              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                              <p>Processing your video...</p>
                              <p className="text-xs mt-2">This may take 3-5 minutes</p>
                              <Button
                                onClick={fetchHistory}
                                variant="ghost"
                                size="sm"
                                className="mt-2"
                              >
                                Check Status
                              </Button>
                            </div>
                          ) : item.status === 'failed' ? (
                            <div className="text-center text-red-500">
                              <p>Processing failed</p>
                              {item.error && <p className="text-sm mt-1">{item.error}</p>}
                              <Link 
                                href="/"
                                className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                              >
                                Try Again
                              </Link>
                            </div>
                          ) : (
                            <div className="text-center">
                              <p className="text-gray-500">Waiting to start processing...</p>
                              <Link 
                                href="/"
                                className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED] bg-white border border-[#8B5CF6] rounded-md hover:bg-purple-50 transition-colors"
                              >
                                Transform Another Video
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-medium mb-2">Transformation Parameters</h4>
                    <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                      {JSON.stringify(item.transformationParameters, null, 2)}
                    </pre>
                  </div>

                  {item.error && (
                    <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">
                      Error: {item.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 