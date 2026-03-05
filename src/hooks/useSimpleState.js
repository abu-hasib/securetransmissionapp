import { useReducer } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'pending':
      return {
        ...state,
        status: 'pending',
        data: action.data ?? null,
        error: null,
        loading: action.loading,
      };

    case 'resolved':
      return {
        ...state,
        status: 'resolved',
        payload: action.payload,
        data: action.data ?? null,
        error: null,
        loading: action.loading,
      };

    case 'success':
      return {
        ...state,
        status: 'success',
        payload: action.payload,
        data: action.data ?? null,
        error: null,
        loading: action.loading,
      };

    case 'rejected':
      return {
        ...state,
        status: 'rejected',
        data: null,
        error: action.error,
        loading: false,
      };

    case 'refresh':
      return {
        ...state,
        status: 'idle',
        data: null,
        payload: null,
        error: null,
        loading: false,
      };
      
    case 'idle':
      return { ...state, status: 'idle' };
    default:
      return state;
  }
};

export default function useSimpleState(initialState = {}) {
  const [state, dispatch] = useReducer(reducer, {
    status: 'idle',
    data: null,
    loading: null,
    payload: null,
    error: null,
    ...initialState,
  });

  const isLoading = state.status === 'pending';
  const isError = state.status === 'rejected';
  const isSuccess = state.status === 'resolved';

  return { ...state, isLoading, isError, isSuccess, dispatch };
}
