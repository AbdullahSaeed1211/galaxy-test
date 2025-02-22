'use client';

import { useEffect, useState } from 'react';
import { VideoProcessing } from '@/lib/models/video';
import { Button } from '@/app/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

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

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/video/history');
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data: HistoryResponse = await response.json();
      setHistory(data.records || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Processing History</h1>
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Processing History</h1>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchHistory} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Processing History</h1>
        {Array.isArray(history) && history.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No video processing history yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{item.sourceVideoName}</h3>
                    <p className="text-sm text-gray-500">
                      Processed {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : item.status === 'processing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>

                {item.transformedVideoUrl && (
                  <div className="mt-4">
                    <video
                      src={item.transformedVideoUrl}
                      controls
                      className="w-full rounded-md"
                    />
                    <a
                      href={item.transformedVideoUrl}
                      download
                      className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      Download Video
                    </a>
                  </div>
                )}

                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium mb-2">Transformation Parameters</h4>
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                    {JSON.stringify(item.transformationParameters, null, 2)}
                  </pre>
                </div>

                {item.error && (
                  <div className="mt-4 text-sm text-red-600">
                    Error: {item.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 