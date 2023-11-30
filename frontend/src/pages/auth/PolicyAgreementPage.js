/* eslint-disable import/no-unresolved */
/* eslint-disable import/order */
// @mui
import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader, Container, Link, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { getDataFromApi } from 'src/utils/apiCalls';
import Image from 'src/components/image/Image';
import PolicyLayout from 'src/layouts/policy/PolicyLayout';
import PolicyAgreementList from 'src/sections/auth/PolicyAgreementList';

export default function PolicyAgreementPage() {
  const [data, setData] = useState([]);
  const getPolicies = () => {
    const policyList = [];
    getDataFromApi(`policy/list`).then((res) => {
      // eslint-disable-next-line array-callback-return
      res.data.map((policy) => {
        if (policy.status === 'active') {
          policyList.push(policy);
        }
      });

      console.log('polcies list', policyList);
      setData(policyList);
    });
  };
  useEffect(() => {
    getPolicies();
  }, []);
  return (
    <>
      <Helmet>
        <title>Policy Agreement | HRMS</title>
      </Helmet>
      <PolicyAgreementList />
    </>
  );
}
