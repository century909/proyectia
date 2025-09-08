import React, { createContext, useContext, useReducer } from 'react';
import ToastContainer from '../ui/Toast/ToastContainer';

// Action types
const ADD_TOAST = 'ADD_TOAST';
const REMOVE_TOAST = 'REMOVE_TOAST';

// Initial state
const initialState = {
  toasts: []
};

// Reducer
const toastReducer = (state, action) => {
  switch (action.type) {
    case ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      };
    case REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };
    default:
      return state;
  }
};

// Context
const ToastContext = createContext();

// Provider component
export const ToastProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    dispatch({
      type: ADD_TOAST,
      payload: {
        id,
        message,
        type,
        duration
      }
    });

    // Auto remove toast after duration
    setTimeout(() => {
      dispatch({
        type: REMOVE_TOAST,
        payload: id
      });
    }, duration);
  };

  const removeToast = (id) => {
    dispatch({
      type: REMOVE_TOAST,
      payload: id
    });
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={state.toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};