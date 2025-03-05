export function LoadingSpinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
} 