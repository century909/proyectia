import React from 'react';
import { useToast } from '../contexts/ToastContext';
import { onApiEvent } from '../services/api';

export default function UnauthorizedHandler() {
  const { addToast } = useToast();
  
  React.useEffect(() => {
    const off = onApiEvent((event, payload) => {
      if (event === 'unauthorized') {
        addToast('Tu sesión expiró. Ingresa nuevamente.', 'warning');
      }
    });
    return off;
  }, [addToast]);

  return null;
}

