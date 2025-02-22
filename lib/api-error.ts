export class APIError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code: string = 'INTERNAL_SERVER_ERROR'
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): APIError {
  if (error instanceof APIError) {
    return error;
  }

  if (error instanceof Error) {
    return new APIError(error.message);
  }

  return new APIError('An unexpected error occurred');
}

export function createErrorResponse(error: APIError) {
  return new Response(
    JSON.stringify({
      error: {
        message: error.message,
        code: error.code,
      },
    }),
    {
      status: error.status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
} 