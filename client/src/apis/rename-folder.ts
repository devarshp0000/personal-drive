import axios from 'axios';
import { APIResponse } from './types';
import { handleAxiosError } from './handle-axios-error';
export type RenameFolderResp = string;

export const renameFolder = async (
  folderName: string,
  newFolderName: string
) => {
  let resp: APIResponse<RenameFolderResp>;
  try {
    const response = await axios<RenameFolderResp>({
      url: `/api/folders/${folderName}`,
      method: 'put',
      data: {
        newFolderName,
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
