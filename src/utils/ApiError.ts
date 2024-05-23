export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  data: any;
  errors: [] | string | null;
  success: boolean;
}
class ApiError extends Error {
  statusCode;
  message;
  data: [] | null;
  errors;
  success;

  constructor(
    statusCode: number,
    message: string,
    errors: [] | string = [],
    stack: string = ""
  ) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.errors = errors;
    this.success = false;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
