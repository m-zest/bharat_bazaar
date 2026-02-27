export function apiResponse(statusCode: number, body: any) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

export function success(data: any) {
  return apiResponse(200, { success: true, data });
}

export function error(statusCode: number, message: string, code?: string) {
  return apiResponse(statusCode, {
    success: false,
    error: { message, code: code || 'INTERNAL_ERROR' },
  });
}

export function throttled(message: string, retryAfterSeconds?: number) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  };
  if (retryAfterSeconds) {
    headers['Retry-After'] = String(retryAfterSeconds);
  }
  return {
    statusCode: 429,
    headers,
    body: JSON.stringify({
      success: false,
      error: { message, code: 'RATE_LIMITED' },
    }),
  };
}
