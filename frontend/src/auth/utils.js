/* eslint-disable consistent-return */
// routes
import { tr } from 'date-fns/locale';
import { getLoadingButtonUtilityClass } from '@mui/lab';
import { PATH_AUTH } from '../routes/paths';
// utils
import axios from '../utils/axios';

// ----------------------------------------------------------------------

export function jwtDecode(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert('Token expired');

    localStorage.removeItem('accessToken');

    window.location.href = PATH_AUTH.login;
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // This function below will handle when token is expired
    const { exp } = jwtDecode(accessToken); // ~3 days by minimals server
    tokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');

    delete axios.defaults.headers.common.Authorization;
  }
};

export const isCustomerLoggedIn = () => Boolean(localStorage.getItem('cusAccessToken'));

export const customerId = () => {
  const user = getLoggedInCustomer();
  return user?.id ?? undefined;
};

export const customerName = () => {
  const user = getLoggedInCustomer();
  return user?.name ?? undefined;
};

// eslint-disable-next-line consistent-return
export const getLoggedInCustomer = () => {
  if (isCustomerLoggedIn()) {
    const user = localStorage.getItem('cusAccessToken');
    let userObj;

    if (user) {
      userObj = jwtDecode(user);
    }

    return userObj;
  }
};

export const saveCustomer = (token) => {
  if (token) localStorage.setItem('cusAccessToken', token);
  return Boolean(localStorage.getItem('cusAccessToken'));
};

export const logoutCustomer = () => {
  localStorage.clear('cusAccessToken');
  window.location.reload();
};

export const authorizedCustomerOnly = () => {
  if (!isCustomerLoggedIn()) window.location.href = '/product';
};

window.authorizedCustomerOnly = authorizedCustomerOnly;

// Admin functions
export const isAdminLoggedIn = () => Boolean(localStorage.getItem('adminAccessToken'));

export const adminId = () => {
  const user = getLoggedInAdmin();
  return user?.id ?? undefined;
};

export const adminName = () => {
  const user = getLoggedInAdmin();
  return user?.name ?? undefined;
};

export const getLoggedInAdmin = () => {
  if (isAdminLoggedIn()) {
    const useDetailsJsonString = localStorage.getItem('adminDetails') ?? '{}';
    let user = {};
    try {
      user = JSON.parse(useDetailsJsonString);
    } catch (error) {
      return false;
    }
    return user;
  }
};

export const adminToken = () => localStorage.getItem('adminAccessToken') ?? '';
export const saveAdmin = (data) => {
  if (data.token) {
    localStorage.setItem('adminAccessToken', data.token);
    localStorage.setItem('adminDetails', JSON.stringify(data));
  }
  return Boolean(localStorage.getItem('adminAccessToken'));
};

export const logoutAdmin = () => {
  localStorage.clear('adminAccessToken');
  window.location.reload();
};

export const authorizedAdminOnly = () => {
  if (!isAdminLoggedIn()) window.location.href = '/product';
};

const checkPermission = (permission) => {
  if (permission === '') return false;
  try {
    permission = permission.split('.');
  } catch (err) {
    return false;
  }
  let tempUserPermission = getLoggedInAdmin()?.permissions;
  permission.forEach((item) => {
    if (typeof tempUserPermission === 'object') tempUserPermission = tempUserPermission[`${item}`];
  });

  return Boolean(tempUserPermission);
};

window.checkPermission = checkPermission;

window.authorizedAdminOnly = authorizedAdminOnly;
