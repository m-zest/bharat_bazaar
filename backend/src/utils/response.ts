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
