import { useContext, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, Typography, SxProps } from '@mui/material';
import { Folder as FolderIcon } from '@mui/icons-material';

import { BasicMenu, BasicMenuProps } from './BasicMenu';

import { renameFolder, deleteFolder } from '../apis';
import { DialogContext, ToastContext } from '../contexts';

export interface FolderProps {
  name: string;
  size: string;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

const cardStyle: SxProps = {
  width: 150,
  cursor: 'pointer',
  height: 180,
  margin: '10px',
};

const folderIconStyle: SxProps = {
  width: 35,
  height: 35,
};

function Folder({ name, size, setRefresh }: FolderProps) {
  const navigate = useNavigate();
  const dialog = useContext(DialogContext);
  const toast = useContext(ToastContext);
  const renameFolderNameController = async (
    canceled?: boolean,
    folderNewName?: string
  ) => {
    if (canceled) {
      return;
    }
    const renameResp = await renameFolder(name, folderNewName as string);
    if (renameResp.status === 'success') {
      toast.success(renameResp.data);
      setRefresh((prev) => !prev);
    } else toast.error(renameResp.data);
  };
  const deleteFolderController = async (canceled?: boolean) => {
    if (canceled) {
      return;
    }
    const deleteResp = await deleteFolder(name);
    if (deleteResp.status === 'success') {
      toast.success(deleteResp.data);
      setRefresh((prev) => !prev);
    } else toast.error(deleteResp.data);
  };
  const menuItems: BasicMenuProps = {
    menuItems: [
      {
        name: 'Delete',
        action: () => {
          dialog.show({
            done: deleteFolderController,
            primaryButtonLabel: 'Delete',
            title: `Delete ${name}?`,
          });
        },
      },
      {
        name: 'Rename',
        action: () => {
          dialog.show({
            done: renameFolderNameController,
            primaryButtonLabel: 'Rename',
            title: `Rename ${name}?`,
            formLabel: 'New name',
            isForm: true,
          });
        },
      },
    ],
  };
  return (
    <>
      <Card
        variant="elevation"
        sx={cardStyle}
        onClick={() => {
          navigate(`/folder/${encodeURIComponent(name)}`);
        }}
      >
        <CardContent>
          <div className="flex justify-content-flex-end">
            <BasicMenu {...menuItems} />
          </div>
          <FolderIcon sx={folderIconStyle} />
          <Typography variant="subtitle1">{name}</Typography>
          <Typography variant="caption">{size}</Typography>
        </CardContent>
      </Card>
    </>
  );
}

export { Folder };
