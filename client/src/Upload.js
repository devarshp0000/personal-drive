import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useFileUpload from 'react-use-file-upload';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import LoadingButton from '@mui/lab/LoadingButton';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import DeleteIcon from '@mui/icons-material/Delete';

function CircularProgressWithLabel(props) {
  return (
    <Box
      sx={{ position: 'relative', display: 'inline-flex', marginTop: '0.5rem' }}
    >
      <CircularProgress variant="determinate" {...props} />
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
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const Upload = ({ setRefresh, toast }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadValue, setUploadValue] = useState(0);
  const {
    fileNames,
    handleDragDropEvent,
    clearAllFiles,
    createFormData,
    setFiles,
    removeFile,
  } = useFileUpload();

  const inputRef = useRef();
  const stopUserFromLeavingPage = (e) => {
    if (!isUploading) return;
    e.preventDefault();
    e.returnValue = '';
  };
  useEffect(() => {
    window.addEventListener('beforeunload', stopUserFromLeavingPage);
    return () => {
      window.removeEventListener('beforeunload', stopUserFromLeavingPage);
    };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = createFormData();

    try {
      setIsUploading(true);
      await axios.post('/api/upload', formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
        onUploadProgress: (data) => {
          setUploadValue((100 * data.loaded) / data.total);
        },
      });
      toast('Uploaded successfully');
      setRefresh((refresh) => !refresh);
    } catch (error) {
      console.error('Failed to submit files.');
    } finally {
      setIsUploading(false);
      clearAllFiles();
      setUploadValue(0);
      setFileUploaded(false);
    }
  };

  return (
    <div>
      <h1>Upload File</h1>

      <div className="form-container">
        {/* Provide a drop zone and an alternative button inside it to upload files. */}
        <Box
          onDragEnter={handleDragDropEvent}
          onDragOver={handleDragDropEvent}
          onDrop={(e) => {
            if (fileNames.length) return;
            handleDragDropEvent(e);
            setFiles(e, 'a');
            setFileUploaded(true);
          }}
          sx={{ bgcolor: '#cfe8fc', padding: '1rem' }}
        >
          <p>Drag and drop file here</p>

          {
            <Button
              variant="contained"
              size="medium"
              disabled={fileUploaded}
              onClick={() => inputRef.current.click()}
            >
              Or select file to upload
            </Button>
          }

          {/* Hide the crappy looking default HTML input */}
          <input
            ref={inputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (fileNames.length) return;
              setFiles(e, 'a');
              inputRef.current.value = null;
              setFileUploaded(true);
            }}
          />
        </Box>
        {isUploading && <CircularProgressWithLabel value={uploadValue} />}
        <div>
          <List>
            {fileNames.map((name) => (
              <ListItem key={name}>
                <ListItemText>{name}</ListItemText>

                <ListItemAvatar
                  onClick={() => {
                    setFileUploaded(false);
                    removeFile(name);
                  }}
                >
                  <DeleteIcon />
                </ListItemAvatar>
              </ListItem>
            ))}
          </List>
        </div>
      </div>

      <LoadingButton
        loading={isUploading}
        onClick={handleSubmit}
        variant="contained"
        disabled={!fileUploaded}
        className="submit"
      >
        Submit
      </LoadingButton>
    </div>
  );
};

export default Upload;
