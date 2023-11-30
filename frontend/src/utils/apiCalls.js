import { adminToken } from '../auth/utils';
import { BASE_URL } from '../config-global';

export const getDataFromApi = (apiName) =>
  fetch(`${BASE_URL}/${apiName}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'applcation/json',
      authorization: adminToken(),
    },
    method: 'GET',
  })
    .then((response) => response.json())
    .then((myJson) => myJson)
    .catch((error) => {
      window.Toast('Unable to fetch data', { variant: 'error' });

      throw error;
    });

// all api calls to post data

export const postDataToApi = (apiName, data, method = 'POST') =>
  fetch(`${BASE_URL}/${apiName}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      authorization: adminToken(),
    },
    method,
    body: data,
  })
    .then((response) => response.json())
    .catch((error) => {
      window.Toast('server error', { variant: 'error' });

      throw error;
    });

export const putDataFromApi = (apiName, data) =>
  fetch(`${BASE_URL}/${apiName}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'applcation/json',
      authorization: adminToken(),
    },
    method: 'PUT',
    body: data,
  })
    .then((response) => response.json())
    .then((myjson) => myjson)
    .catch((error) => {
      throw error;
    });

export const deleteDataFromApi = (apiName, data) => {
  fetch(`${BASE_URL}/${apiName}`, {
    headers: {
      'Content-Type': 'application/json',
      // Accept: 'applcation/json',
      authorization: adminToken(),
    },
    method: 'DELETE',
    body: data,
  })
    .then((response) => response.json())
    .then((myjson) => myjson)
    .catch((error) => {
      throw error;
    });
};

export const axiosPostDataToApi = (apiName, body, method = 'POST') => {
  fetch(`${BASE_URL}/${apiName}`, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      authorization: adminToken(),
    },
    method,
    body,
  })
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
};
