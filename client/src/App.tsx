import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Router from './pages';

import { Container } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  CustomDialog as Dialog,
  CustomDialogProps as DialogProps,
} from './components';

import { ToastContext, DialogContext } from './contexts';
import { useRef, useState } from 'react';

function App() {
  const [dialogProps, setDialogProps] = useState<
    Omit<DialogProps, 'setDialogOpener'>
  >({
    title: '',
    done: () => {},
    primaryButtonLabel: '',
  });
  const ref = useRef<{ show: () => void }>();

  return (
    <Container className="App">
      <BrowserRouter>
        <ToastContext.Provider
          value={{
            error: toast.error,
            warning: toast.warning,
            success: toast.success,
            info: toast.info,
          }}
        >
          <DialogContext.Provider
            value={{
              show: (options) => {
                setDialogProps(options);
                ref.current?.show();
              },
            }}
          >
            <Router />
          </DialogContext.Provider>
        </ToastContext.Provider>
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <Dialog ref={ref} {...dialogProps} />
    </Container>
  );
}

export default App;
