import { createContext } from 'react';
import { ToastOptions } from 'react-toastify';

export const ToastContext = createContext({
  error: (message: string) => {},
  success: (message: string) => {},
  warning: (message: string) => {},
  info: (message: string, options?: ToastOptions) => {},
});
