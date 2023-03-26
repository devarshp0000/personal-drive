import axios from 'axios';
import { APIResponse } from './types';
import { handleAxiosError } from './handle-axios-error';
export type CreateFolderResp = string;

export const createFolder = async (folderName: string) => {
  let resp: APIResponse<CreateFolderResp>;
  try {
    const response = await axios<CreateFolderResp>({
      url: `/api/folders`,
      method: 'post',
      data: {
        folderName,
      },
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
