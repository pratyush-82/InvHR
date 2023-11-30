import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import AddNewEmployeeForm from '../../sections/@dashboard/Employee/AddNewEmployeeForm';
// ----------------------------------------------------------------------

export default function EmployeeCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Add Employee | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Add Employee"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Employee',
              href: PATH_DASHBOARD.employee.list,
            },
            { name: 'New Employee' },
          ]}
        />
        <AddNewEmployeeForm />
      </Container>
    </>
  );
}
