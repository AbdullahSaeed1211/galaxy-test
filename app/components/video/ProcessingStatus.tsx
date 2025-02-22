import { RefreshCw } from "lucide-react";
import Link from "next/link";

export function ProcessingStatus() {
  return (
    <div className="mt-4 text-center space-y-4">
      <div className="p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-800 font-medium mb-2">
          Your video is being processed
        </p>
        <p className="text-sm text-purple-600">
          This typically takes 3-5 minutes. You can check the status in your history.
        </p>
      </div>
      <Link
        href="/history"
        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED] bg-white border border-[#8B5CF6] rounded-md hover:bg-purple-50 transition-colors">
        <RefreshCw className="w-4 h-4" />
        View Status in History
      </Link>
    </div>
  );
} 