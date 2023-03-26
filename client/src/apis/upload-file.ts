import axios, { AxiosProgressEvent } from 'axios';
import { APIResponse } from './types';
import { handleAxiosError } from './handle-axios-error';
export type UploadFileResp = string;
export type TrackProgressHandler = (event: AxiosProgressEvent) => void;

export const uploadFile = async (
  folderName: string,
  data: FormData,
  trackProgress: TrackProgressHandler
) => {
  let resp: APIResponse<UploadFileResp>;
  try {
    const response = await axios<UploadFileResp>({
      url: `/api/folders/${folderName}/files`,
      method: 'post',
      data,
      onUploadProgress: trackProgress,
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
