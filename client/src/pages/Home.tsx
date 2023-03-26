import { useContext, useEffect, useState } from 'react';
import { Button } from '@mui/material';

import { Folder } from '../components';
import { getFolders, FoldersResp, createFolder } from '../apis';
import { DialogContext, ToastContext } from '../contexts';

const getSizeStr = (size: number) => {
  const unit = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (size > 1000) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)}${unit[i]}`;
};

function Home() {
  const dialog = useContext(DialogContext);
  const toast = useContext(ToastContext);

  const [refresh, setRefresh] = useState(false);
  const [folders, setFolders] = useState<FoldersResp>([]);
  const [loading, setLoading] = useState<boolean>();
  useEffect(() => {
    setLoading(true);
    getFolders().then((resp) => {
      setLoading(false);
      if (resp.status === 'success') {
        setFolders(resp.data);
      }
    });
  }, [refresh]);
  const createFolderController = async (
    canceled?: boolean,
    newFolderName?: string
  ) => {
    if (canceled) {
      return;
    }
    const createFolderResp = await createFolder(newFolderName as string);
    if (createFolderResp.status === 'success') {
      toast.success(createFolderResp.data);
      setRefresh((prev) => !prev);
    } else toast.error(createFolderResp.data);
  };
  return (
    <>
      <h2>Root Folder</h2>
      <Button
        onClick={() => {
          dialog.show({
            done: createFolderController,
            primaryButtonLabel: 'create',
            title: 'Create new folder',
            formLabel: 'Folder name',
            isForm: true,
          });
        }}
        variant="contained"
      >
        Create new folder
      </Button>
      <div className="list">
        {loading
          ? 'Loading...'
          : folders.length
          ? folders.map((folder) => (
              <Folder
                key={folder.name}
                name={folder.name}
                size={getSizeStr(folder.size)}
                setRefresh={setRefresh}
              />
            ))
          : 'Folder is empty'}
      </div>
    </>
  );
}

export default Home;
