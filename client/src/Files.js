import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Download from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import axios from 'axios';

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log('Async: Copying to clipboard was successful!');
    },
    function (err) {
      console.error('Async: Could not copy text: ', err);
    }
  );
}

const Files = ({ refresh, setRefresh }) => {
  const [files, setFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState();
  const [fileId, setFileId] = useState();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const resp = await axios.get('/api/files');
        setFiles(resp.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFiles();
  }, [refresh]);
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const resp = await axios.get('/api/files');
        setFiles(resp.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFiles();
  }, []);
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/files/${fileId}`);
      setRefresh((refresh) => !refresh);
    } catch (error) {
      console.error(error);
    } finally {
      handleClose();
    }
  };
  const handleDownload = async (id) => {
    window.open(`/api/files/${id}`);
    // try {
    //     await axios.get(`/api/files/${id}`);
    // } catch (error) {
    //     console.error(error);
    // }
  };
  const handleCopy = (id) => {
    copyTextToClipboard(
      `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/files/stream/${id}`
    );
  };
  const handleDeleteFile = (id, name) => {
    setOpen(true);
    setFileId(id);
    setFileName(name);
  };
  /**
   *
   * @param {number} size
   * @returns
   */
  const getSizeStr = (size) => {
    const unit = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (size > 1000) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(2)}${unit[i]}`;
  };
  /**
   *
   * @param {string} name
   */
  const getName = (name) => {
    const MAX_SIZE = 40;
    return name.length > MAX_SIZE ? `${name.substring(0, MAX_SIZE)}...` : name;
  };
  return (
    <div>
      <List>
        {files.map(({ name, id, size }) => (
          <ListItem key={id}>
            <ListItemText
              sx={{ cursor: 'pointer' }}
              onClick={(e) => {
                handleCopy(id);
              }}
            >
              {getName(name)}
            </ListItemText>
            <ListItemText>{getSizeStr(size)}</ListItemText>
            <ListItemAvatar
              onClick={() => {
                handleDeleteFile(id, name);
              }}
            >
              <DeleteIcon cursor="pointer" />
            </ListItemAvatar>
            <ListItemAvatar
              onClick={() => {
                handleDownload(id);
              }}
            >
              <Download cursor="pointer" />
            </ListItemAvatar>
          </ListItem>
        ))}
      </List>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete "{fileName}" ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="warning" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Files;
