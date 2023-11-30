/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios from '../utils/axios';
import localStorageAvailable from '../utils/localStorageAvailable';
//
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axios.get('/api/account/my-account');

        const { user } = response.data;

        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (empId, password) => {
    const response = await axios.post('/api/auth/login', {
      empId,
      password,
    });
    setSession(response.data.token);
    // console.log('121', setSession);
    console.log('122', response.data.data.token);
    localStorage.setItem('token', response.data.data.token);
    delete response.data.token;

    dispatch({
      type: 'LOGIN',
      payload: {
        ...response.data,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/auth/register', {
      email,
      password,
      name: `${firstName} ${lastName}`,
    });

    localStorage.setItem('accessToken', response.data.token);

    delete response.data.token;
    dispatch({
      type: 'REGISTER',
      payload: {
        ...response.data,
      },
    });
  }, []);

  // RESET PASSWORD
  const resetpassword = useCallback(async (email) => {
    const response = await axios.post('/api/auth/forgot-password', {
      email,
    });
    localStorage.setItem('otpToken', response.data.otpToken);
    dispatch({
      type: 'RESETPASSWORD',
      payload: {
        ...response.data,
      },
    });
  }, []);

  // Update password
  const updatepassword = useCallback(async (otp, otpToken, password) => {
    const OTPToken = localStorage.getItem('otpToken', response.data.otpToken);
    const response = await axios.post('/api/auth/update-password', {
      otp,
      otpToken: OTPToken,
      password,
    });
    console.log('181', response);
    dispatch({
      type: 'UPDATEPASSWORD',
      payload: {
        ...response.data,
        otpToken,
      },
    });
  }, []);

  const reSendOTP = useCallback(async (OTPToken) => {
    const response = await axios.post('/api/auth/resend-otp', {
      OTPToken,
    });
    dispatch({
      type: 'RESENDOTP',
      payload: {
        ...response.data,
      },
    });
  });

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      login,
      register,
      resetpassword,
      updatepassword,
      logout,
    }),
    [
      state.isAuthenticated,
      state.isInitialized,
      state.user,
      login,
      logout,
      resetpassword,
      register,
      updatepassword,
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
