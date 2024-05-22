interface ApiErrorDetail {
  message: string;
  field?: string;
}

class ApiError extends Error {
  statusCode: number;
  message: string;
  data: null;
  errors: ApiErrorDetail[];
  success: boolean;

  constructor(
    statusCode: number,
    message: string = "Something went wrong!!",
    errors: ApiErrorDetail[] = [],
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.errors = errors;
    this.success = false;
    if (stack) {
      this.stack = stack;
    }
  }
}

export default ApiError;
