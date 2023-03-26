import axios from 'axios';
import { APIResponse } from './types';
import { handleAxiosError } from './handle-axios-error';
export type FoldersResp = { name: string; size: number }[];

export const getFolders = async () => {
  let resp: APIResponse<FoldersResp>;
  try {
    const response = await axios<FoldersResp>({
      url: '/api/folders',
      method: 'get',
    });
    resp = {
      status: 'success',
      data: response.data,
    };
  } catch (error: any) {
    return handleAxiosError(error);
  }
  return resp;
};
