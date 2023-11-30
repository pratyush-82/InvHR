import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Stack, Typography } from '@mui/material';
// routes
import { useParams } from 'react-router';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import AddEditDesignationForm from '../../sections/@dashboard/Designation/AddEditDesignationForm';
import { getDataFromApi } from '../../utils/apiCalls';
// ----------------------------------------------------------------------

export default function DesignationViewPage() {
  const { themeStretch } = useSettingsContext();

  const [role, setRole] = useState({});
  const { id } = useParams();
  function getDesignationById() {
    getDataFromApi(`designation/${id}`).then((res) => {
      setRole(res.data);
      console.log('22', res.data);
    });
  }

  useEffect(() => {
    getDesignationById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title> View Designation | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" component="div" align="center">
            View Designation
          </Typography>
        </Stack>
        <AddEditDesignationForm isView row={role} />
      </Container>
    </>
  );
}
