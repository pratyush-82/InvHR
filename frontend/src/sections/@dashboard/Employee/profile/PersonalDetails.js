import PropTypes from 'prop-types';
// @mui
import { Box, Card, Typography, Grid, Divider } from '@mui/material';
// components
import { convertDateTimeFormat } from '../../../../utils/common';

// ----------------------------------------------------------------------

PersonalDetails.propTypes = {
  currentemployee: PropTypes.object,
};

export default function PersonalDetails({ currentemployee }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ pt: 4, pb: 5, px: 3 }}>
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
              <b>Gender: </b> {currentemployee.gender}
            </Typography>
            <Typography>
              <b>Marital Status: </b> {currentemployee.maritalStatus}
            </Typography>
            <Typography>
              <b>Father Name: </b> {currentemployee.fatherName}
            </Typography>
            <Typography>
              <b>Personal Email: </b> {currentemployee.personalEmail}
            </Typography>
            <Typography>
              <b>Blood Group: </b> {currentemployee.bloodGroup}
            </Typography>
            <Typography>
              <b>Date Of Birth: </b> {currentemployee.DOB}
            </Typography>
          </Box>
          &nbsp;
          <Divider />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Address
          </Typography>
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
              <b>Country: </b> {currentemployee.country}
            </Typography>
            <Typography>
              <b>State/Region: </b> {currentemployee.state}
            </Typography>
            <Typography>
              <b>City: </b> {currentemployee.city}
            </Typography>
            <Typography>
              <b>Address: </b> {currentemployee.address}
            </Typography>
            <Typography>
              <b>Zip/Code: </b> {currentemployee.zipCode}
            </Typography>
          </Box>
          &nbsp;
          <Divider />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Bank Details
          </Typography>
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
              <b>Name: </b> {currentemployee.bankName}
            </Typography>
            <Typography>
              <b>IFSC Code: </b> {currentemployee.IFSCCode}
            </Typography>
            <Typography>
              <b>Account Number: </b> {currentemployee.accountNumber}
            </Typography>
          </Box>
          &nbsp;
          <Divider />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Highest Education
          </Typography>
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
              <b>Degree/Education: </b> {currentemployee.education}
            </Typography>
            <Typography>
              <b>Mark(%): </b> {currentemployee.percentage}
            </Typography>
            <Typography>
              <b>Board/University: </b> {currentemployee.board}
            </Typography>
            <Typography>
              <b>Year of Passing: </b>{' '}
              {currentemployee && currentemployee.yrOfPassing
                ? convertDateTimeFormat(currentemployee.yrOfPassing)
                : ''}
            </Typography>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}
