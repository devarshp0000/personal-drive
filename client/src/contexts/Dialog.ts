import { createContext } from 'react';

import { CustomDialogProps } from '../components';

export const DialogContext = createContext({
  show: (options: Omit<CustomDialogProps, 'setDialogOpener'>) => {},
});
