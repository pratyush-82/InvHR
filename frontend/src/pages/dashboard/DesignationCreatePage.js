import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Stack, Typography } from '@mui/material';
// routes
// components
import { useSettingsContext } from '../../components/settings';
// sections
import AddEditDesignationForm from '../../sections/@dashboard/Designation/AddEditDesignationForm';
// ----------------------------------------------------------------------

export default function DesignationCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Add Designation | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" component="div" align="center">
            Add Designation
          </Typography>
        </Stack>
        <AddEditDesignationForm />
      </Container>
    </>
  );
}
