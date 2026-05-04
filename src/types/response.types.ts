export type SuccessResponseOptions<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export type ErrorResponseOptions = {
  statusCode: number;
  message: string;
  details?: unknown;
};
