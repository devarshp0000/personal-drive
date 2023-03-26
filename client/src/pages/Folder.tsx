import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { File, Upload } from '../components';
import { getFilesOfFolders } from '../apis';
import { ToastContext } from '../contexts';
import { Box } from '@mui/material';

const getSizeStr = (size: number) => {
  const unit = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (size > 1000) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)}${unit[i]}`;
};

interface IFile {
  name: string;
  size: number;
}

function Folder() {
  const { folderName } = useParams<{ folderName: string }>();

  // const dialog = useContext(DialogContext);
  const toast = useContext(ToastContext);

  const [refresh, setRefresh] = useState(false);
  const [files, setFiles] = useState<Array<IFile>>([]);
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    setLoading(true);
    if (!folderName) return;
    setLoading(true);
    getFilesOfFolders(folderName).then((files) => {
      if (files.status === 'success') {
        setFiles(files.data);
      } else {
        toast.error(files.data);
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);
  return (
    <>
      <h3>{folderName}</h3>
      <Box
        sx={{
          width: window.innerWidth < 600 ? '100%' : '90%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 'auto',
          pt: 2,
          pb: 2,
          borderRadius: 2,
          backgroundColor: '#afc8f0',
        }}
      >
        <Upload folderName={folderName as string} setRefresh={setRefresh} />
      </Box>
      <div className="list">
        {loading
          ? 'Loading...'
          : !files.length
          ? 'Empty folder'
          : files.map((file) => (
              <File
                key={file.name}
                name={file.name}
                folderName={folderName as string}
                size={getSizeStr(file.size)}
                setRefresh={setRefresh}
              />
            ))}
      </div>
    </>
  );
}

export default Folder;
