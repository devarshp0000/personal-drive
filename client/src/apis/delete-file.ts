import axios from 'axios';
import { APIResponse } from './types';
import { handleAxiosError } from './handle-axios-error';
export type DeleteFileResp = string;

export const deleteFile = async (folderName: string, fileName: string) => {
  let resp: APIResponse<DeleteFileResp>;
  try {
    const response = await axios<DeleteFileResp>({
      url: `/api/folders/${folderName}/files/${fileName}`,
      method: 'delete',
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
