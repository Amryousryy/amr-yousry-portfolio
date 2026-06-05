export interface PaginationMeta {
  current: number;
  pages: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success?: false;
  error: string;
  issues?: unknown[];
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
