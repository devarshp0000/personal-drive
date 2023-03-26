export interface CustomError {
  url: string;
  response: string;
}
export type APIResponse<T = CustomError> = T extends CustomError
  ? {
      status: 'error';
      data: string;
    }
  : {
      status: 'success';
      data: T;
    };
