import { AxiosError } from 'axios';
import { APIResponse, CustomError } from './types';
export const handleAxiosError = (error: any): APIResponse<CustomError> => {
  if (error.isAxiosError) {
    const e = error as AxiosError<string>;
    return {
      status: 'error',
      data: e.response!.data,
    };
  }
  return {
    status: 'error',
    data: 'Unknown Error',
  };
};
