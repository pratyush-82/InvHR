import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography, Card } from '@mui/material';
// _mock_
// components
import { useSettingsContext } from '../../components/settings';
// sections
import { AnalyticsWidgetSummary } from '../../sections/@dashboard/general/analytics';
import LeaveListPage from './LeaveListPage';
import { getDataFromApi } from '../../utils/apiCalls';
import { EmployeeDetails } from '../../utils/Bouncer';

// ----------------------------------------------------------------------

export default function LeavePage() {
  const { themeStretch } = useSettingsContext();

  const [currentemployee, setcurrentemployee] = useState({});
  const { id: empId } = useParams();
  function getEmployeeById() {
    getDataFromApi(`employee/${EmployeeDetails().empId}`).then((res) => {
      setcurrentemployee(res.data);
    });
  }
  useEffect(() => {
    getEmployeeById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title> Leave | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Leave
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Total Leaves"
              total={currentemployee.totalLeave}
              color="success"
              icon="pepicons-pop:leave"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="leaves in Bucket"
              total={currentemployee.leaveInBucket}
              color="error"
              icon="pepicons-pop:leave"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Availed Leaves"
              total={currentemployee.availedLeave}
              color="info"
              icon="pepicons-pop:leave"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="LOP"
              total={currentemployee.LOP}
              color="warning"
              icon="pepicons-pop:leave"
            />
          </Grid>
        </Grid>
        <Card sx={{ mt: 4 }}>
          <LeaveListPage />
        </Card>
      </Container>
    </>
  );
}
