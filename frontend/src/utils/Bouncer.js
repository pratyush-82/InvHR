/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
import jwt_decode from 'jwt-decode';
import { isEmpty } from 'lodash';
import { getLoggedInAdmin, isAdminLoggedIn } from '../auth/utils';

export function authorisedEmployeeOnly() {
  return isAdminLoggedIn();
}

export function EmployeeDetails() {
  return getLoggedInAdmin();
}
