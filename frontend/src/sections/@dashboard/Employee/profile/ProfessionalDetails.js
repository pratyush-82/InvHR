import PropTypes from 'prop-types';
// @mui
import { Card, Typography, Grid, Box, Divider } from '@mui/material';
// _mock
import { _socials } from '../../../../_mock/arrays';
import { convertDateTimeFormat } from '../../../../utils/common';
// components

// ----------------------------------------------------------------------

ProfessinalDetails.propTypes = {
  currentemployee: PropTypes.object,
  setCurrentTab: PropTypes.func,
};

export default function ProfessinalDetails({ currentemployee, setCurrentTab }) {
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
              <b>Total Year of Experience: </b> {currentemployee.experience}
            </Typography>
          </Box>
          &nbsp;
          <Divider />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Technologies
          </Typography>
          {currentemployee.technologies.map((data, i) => (
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
                <b>Technology Name/Version: </b> {data.technologyName}
              </Typography>
              <Typography>
                <b>Technology Experience: </b> {data.technologyExp}
              </Typography>
              <Typography>
                <b>Technology Year: </b>{' '}
                {data && data.technologyYear ? convertDateTimeFormat(data.technologyYear) : ''}
              </Typography>
            </Box>
          ))}
          &nbsp;
          <Divider />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Organization
          </Typography>
          {currentemployee.organizations.map((data, j) => (
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
                <b>Organization Name: </b> {data.orgName}
              </Typography>
              <Typography>
                <b>Date of Joining: </b>{' '}
                {data && data.orgDOJ ? convertDateTimeFormat(data.orgDOJ) : ''}
              </Typography>
              <Typography>
                <b>Date of Relieving: </b>{' '}
                {data && data.orgDOR ? convertDateTimeFormat(data.orgDOR) : ''}
              </Typography>
            </Box>
          ))}
        </Card>
      </Grid>
    </Grid>
  );
}
