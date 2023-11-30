import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography, Card, Box, Stack, Button, Dialog } from '@mui/material';
// _mock_
// components
import { useSettingsContext } from '../../components/settings';
// sections
import { getDataFromApi } from '../../utils/apiCalls';
import Avatar from '../../theme/overrides/Avatar';
import Iconify from '../../components/iconify/Iconify';
import { CustomAvatar } from '../../components/custom-avatar';
import EmployeeTimeSheetApprovalForm from '../../sections/@dashboard/employeeTimeSheet/EmployeeTimeSheetApprovalForm';
import { ViewGuard } from '../../auth/MyAuthGuard';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';

// ----------------------------------------------------------------------

export default function TimeSheetManagementPage() {
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();

  const [openForm, setOpenForm] = useState(false);

  const [empFormData, setEmpFormData] = useState({});

  const [loading, setLoading] = useState(true);

  const handleOpenModel = () => {
    setOpenForm(true);
  };

  const handleCloseModal = (data) => {
    setOpenForm(false);
    setEmpFormData('');
  };
  const { empId } = useParams();
  console.log(empId, 'empId');

  const [employee, setEmployee] = useState([]);

  function getEmployeeById() {
    getDataFromApi(`employee/list`).then((res) => {
      setEmployee(res.data);
      setLoading(false);
      console.log(res.data, 'employee data');
    });
  }

  useEffect(() => {
    // getDataFromEmployeeId();
    getEmployeeById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ViewGuard permission="project.project.read" page="true">
      <Helmet>
        <title> TimeSheet Management | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          TimeSheet Management
        </Typography>
        {loading && <LoadingScreen />}
        {!loading && (
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            }}
          >
            {employee.map((data, i) => (
              <Card
                key={i}
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {/* <Avatar alt="d" src="d" sx={{ width: 48, height: 48 }} /> */}
                <CustomAvatar
                  src={data.avatarbase64}
                  // alt={name}
                  // name={name}
                  sx={{
                    mx: 'auto',
                    borderWidth: 2,
                    borderStyle: 'solid',
                    borderColor: 'common.white',
                    width: { xs: 50, md: 90 },
                    height: { xs: 50, md: 90 },
                  }}
                />
                <Box
                  sx={{
                    pl: 2,
                    pr: 1,
                    flexGrow: 1,
                    minWidth: 0,
                  }}
                >
                  <Typography variant="subtitle2" noWrap>
                    {data.name}
                  </Typography>

                  <Stack
                    spacing={0.5}
                    direction="row"
                    alignItems="center"
                    sx={{ color: 'text.secondary' }}
                  >
                    {/* <Iconify icon="eva:pin-fill" width={16} sx={{ flexShrink: 0 }} /> */}

                    <Typography variant="body2" component="span" noWrap>
                      {data.empId}
                    </Typography>
                  </Stack>
                </Box>

                <Button
                  size="small"
                  type="submit"
                  variant="outlined"
                  onClick={
                    // () => {
                    // navigate({ state: 'muskan' });
                    handleOpenModel
                    //   ();
                    // }
                  }
                >
                  Approval
                </Button>
              </Card>
            ))}
          </Box>
        )}
      </Container>
      <Dialog fullWidth maxWidth="lg" open={openForm} onClose={handleCloseModal}>
        <EmployeeTimeSheetApprovalForm
          open={openForm}
          onClose={handleCloseModal}
          row={empFormData}
          // event={selectedEvent}
          // range={selectedRange}
          // onCancel={handleCloseModal}
          // row={worklogFormData}
          // onCreateUpdateEvent={handleCreateUpdateEvent}
          // onDeleteEvent={handleDeleteEvent}
        />
      </Dialog>
    </ViewGuard>
  );
}
