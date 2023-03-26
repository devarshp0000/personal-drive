import { Avatar, ListItemAvatar, Tooltip } from '@mui/material';

import {
  Archive,
  AudioFile,
  Image,
  InsertDriveFile,
  PictureAsPdf,
  VideoFile,
} from '@mui/icons-material';
import { Dispatch, SetStateAction, useContext } from 'react';

import { DialogContext, ToastContext } from '../contexts';
import { deleteFile } from '../apis';

import { BasicMenu, BasicMenuProps } from './BasicMenu';

export interface FileProps {
  name: string;
  size: string;
  folderName: string;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

const getExtension = (fileName: string) =>
  fileName.substring(fileName.lastIndexOf('.') + 1);

const getAvatarIcon = (extention: string) => {
  switch (extention) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <Image />;
    case 'mp4':
    case 'webm':
    case 'mkv':
    case 'avi':
      return <VideoFile />;
    case 'pdf':
      return <PictureAsPdf />;
    case 'mp3':
      return <AudioFile />;
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'tar.gz':
    case 'tar.bz2':
    case 'tar.xz':
    case 'tar.lzma':
      return <Archive />;
    default:
      return <InsertDriveFile />;
  }
};

function File({ name, size, folderName, setRefresh }: FileProps) {
  const dialog = useContext(DialogContext);
  const toast = useContext(ToastContext);

  const deleteFileController = async (canceled?: boolean) => {
    if (canceled) {
      return;
    }
    const renameResp = await deleteFile(folderName, name);
    if (renameResp.status === 'success') {
      toast.success(renameResp.data);
      setRefresh((prev) => !prev);
    } else toast.error(renameResp.data);
  };
  const downloadFileController = async (canceled?: boolean) => {
    if (canceled) {
      return;
    }
    window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/folders/${folderName}/files/${name}`;
  };
  const menuItems: BasicMenuProps = {
    menuItems: [
      {
        name: 'Delete',
        action: () => {
          dialog.show({
            done: deleteFileController,
            primaryButtonLabel: 'Delete',
            title: `Delete ${name}?`,
          });
        },
      },
      {
        name: 'Download',
        action: () => {
          dialog.show({
            done: downloadFileController,
            primaryButtonLabel: 'Download',
            title: `Download ${name}?`,
          });
        },
      },
    ],
  };
  return (
    <div
      className="flex justify-content-space-between pt-5"
      style={{ width: '100%' }}
    >
      <div>
        <Tooltip title={getExtension(name)}>
          <ListItemAvatar>
            <Avatar>{getAvatarIcon(getExtension(name))}</Avatar>
          </ListItemAvatar>
        </Tooltip>
      </div>
      <div style={{ wordWrap: 'break-word' }}>{name}</div>
      <div>
        <BasicMenu {...menuItems} />
      </div>
    </div>
  );
}

export { File };
