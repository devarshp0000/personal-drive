import axios from 'axios';
import { APIResponse } from './types';
import { handleAxiosError } from './handle-axios-error';
export type FilesOfFolderResp = { name: string; size: number }[];

export const getFilesOfFolders = async (folderName: string) => {
  let resp: APIResponse<FilesOfFolderResp>;
  try {
    const response = await axios<FilesOfFolderResp>({
      url: `/api/folders/${folderName}/files`,
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
