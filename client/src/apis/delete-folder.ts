import axios from 'axios';
import { APIResponse } from './types';
import { handleAxiosError } from './handle-axios-error';
export type DeleteFolderResp = string;

export const deleteFolder = async (folderName: string) => {
  let resp: APIResponse<DeleteFolderResp>;
  try {
    const response = await axios<DeleteFolderResp>({
      url: `/api/folders/${folderName}`,
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
