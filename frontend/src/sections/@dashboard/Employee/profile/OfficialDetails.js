/* eslint-disable import/no-unresolved */
/* eslint-disable import/order */
import PropTypes from 'prop-types';
// @mui
import { Box, Card, Grid, Typography } from '@mui/material';
import { convertDateTimeFormat } from 'src/utils/common';

OfficialDetails.propTypes = {
  currentemployee: PropTypes.object,
};

export default function OfficialDetails({ currentemployee }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Typography>
              <b>Employee ID: </b> {currentemployee.empId}
            </Typography>
            <Typography>
              <b>Employee Name: </b> {currentemployee.name}
            </Typography>
            <Typography>
              <b>Branch: </b> {currentemployee.branchType}
            </Typography>
            <Typography>
              <b>Email: </b> {currentemployee.email}
            </Typography>
            <Typography>
              <b>Reporting Person: </b> {currentemployee.reportingPerson}
            </Typography>
            <Typography>
              <b>Phone Number: </b> {currentemployee.phoneNumber}
            </Typography>
            <Typography>
              <b>Emergency Contact: </b> {currentemployee.emergencyContact}
            </Typography>
            <Typography>
              <b>Employee Type: </b> {currentemployee.employeeType}
            </Typography>
            <Typography>
              <b>Aadhaar Number: </b> {currentemployee.aadharNumber}
            </Typography>
            <Typography>
              <b>PAN Number: </b> {currentemployee.panNumber}
            </Typography>
            <Typography>
              <b>Joining Location: </b> {currentemployee.LOJ}
            </Typography>
            <Typography>
              <b>Date of Joining: </b> {convertDateTimeFormat(currentemployee.DOJ)}
            </Typography>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}
