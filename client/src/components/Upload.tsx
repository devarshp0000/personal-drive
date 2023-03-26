import { CancelOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressProps,
  IconButton,
  Typography,
} from '@mui/material';
import {
  ChangeEvent,
  useState,
  useRef,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react';

import { uploadFile, TrackProgressHandler } from '../apis';
import { ToastContext } from '../contexts';

const getSizeStr = (size: number) => {
  const unit = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (size > 1000) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)}${unit[i]}`;
};

export interface UploadProps {
  folderName: string;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

function CircularProgressWithLabel(
  circularProgressProps: { progressValue: number } & CircularProgressProps
) {
  return (
    <Box
      sx={{ position: 'relative', display: 'inline-flex', marginTop: '0.5rem' }}
    >
      <CircularProgress {...circularProgressProps} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(circularProgressProps.progressValue)}%`}</Typography>
      </Box>
    </Box>
  );
}

function Upload({ folderName, setRefresh }: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const toast = useContext(ToastContext);

  const [fileList, setFileList] = useState<File[] | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setFileList([...e.target.files]);
  };
  const handleUploadClick = () => {
    if (!fileList) {
      return;
    }

    // 👇 Create new FormData object and append files
    const data = new FormData();
    let i = 0;
    for (const file of fileList) {
      data.append(`file-${i++}`, file, file.name);
    }

    const trackProgress: TrackProgressHandler = (event) => {
      if (event.total) setProgress((event.loaded / event.total) * 100);
    };

    (async () => {
      setIsUploading(true);
      const res = await uploadFile(folderName, data, trackProgress);
      setIsUploading(false);
      if (res.status === 'error') {
        toast.error(res.data);
      } else {
        toast.success(res.data);
        setFileList(null);
        setRefresh((prev) => !prev);
      }
    })();
  };

  return (
    <>
      <input
        hidden
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        multiple
      />
      {!fileList?.length && (
        <Button
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          Select files
        </Button>
      )}
      <div style={{ width: '100%' }}>
        {isUploading ? (
          <CircularProgressWithLabel
            variant="determinate"
            progressValue={progress}
          />
        ) : fileList ? (
          fileList.map((file, i) => (
            <div key={i} className="flex justify-content-space-between">
              <div className="flex" style={{ width: '100%' }}>
                <IconButton
                  onClick={() => {
                    setFileList((prev) => {
                      if (!prev) return null;
                      prev.splice(i, 1);
                      if (prev.length === 0) return null;
                      return [...prev];
                    });
                  }}
                >
                  <CancelOutlined />
                </IconButton>
                <p
                  style={{
                    wordBreak: 'break-word',
                    width: '80%',
                    textAlign: 'start',
                    verticalAlign: 'middle',
                  }}
                >
                  {file.name}
                </p>
              </div>
              <p style={{ verticalAlign: 'middle', paddingRight: '10px' }}>
                {getSizeStr(file.size)}
              </p>
            </div>
          ))
        ) : null}
      </div>

      {fileList?.length && !isUploading ? (
        <Button variant="contained" onClick={handleUploadClick}>
          Upload
        </Button>
      ) : null}
    </>
  );
}

export { Upload };
