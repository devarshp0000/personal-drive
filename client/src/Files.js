import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Download from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import axios from 'axios';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [showMobileLink, setMobileLink] = useState('');
  const resizeHandler = () => {
    setIsMobile(window.innerWidth < 600);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

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
    window.addEventListener('resize', resizeHandler);
    const fetchFiles = async () => {
      try {
        const resp = await axios.get('/api/files');
        setFiles(resp.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFiles();
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
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
    handleCloseMenu();
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
    handleCloseMenu();
  };
  const handleDeleteFile = (id, name) => {
    setOpen(true);
    setFileId(id);
    setFileName(name);
    handleCloseMenu();
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
      {Boolean(showMobileLink) && (
        <Alert
          severity="info"
          onClose={() => {
            setMobileLink('');
          }}
          sx={{
            marginTop: '1rem',
            marginBottom: '0.5rem',
          }}
        >
          <p
            onClick={(e) => {
              const text = e.target.innerHTML;
              copyTextToClipboard(text);
            }}
          >{`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/files/stream/${showMobileLink}`}</p>
        </Alert>
      )}
      <List>
        {files.map(({ name, id, size }) => (
          <ListItem key={id}>
            <ListItemText>{getName(name)}</ListItemText>
            <ListItemText>{getSizeStr(size)}</ListItemText>
            {!isMobile ? (
              <>
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
                <ListItemAvatar
                  onClick={() => {
                    handleCopy(id);
                  }}
                >
                  <ContentCopyIcon cursor="pointer" />
                </ListItemAvatar>
              </>
            ) : (
              <>
                <IconButton
                  aria-label="more"
                  id={`long-button-${id}`}
                  aria-controls={openMenu ? `long-menu-${id}` : undefined}
                  aria-expanded={openMenu ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClickMenu}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleCloseMenu}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <MenuItem onClick={() => handleDeleteFile(id, name)}>
                    Delete
                  </MenuItem>
                  <MenuItem onClick={() => handleDownload(id)}>
                    Download
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setMobileLink(id);
                      handleCloseMenu();
                      setTimeout(() => setMobileLink(''), 10000);
                    }}
                  >
                    Copy link
                  </MenuItem>
                </Menu>
              </>
            )}
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
