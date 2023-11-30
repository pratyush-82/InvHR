/* eslint-disable import/no-unresolved */
/* eslint-disable import/order */
// @mui
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader, Container, Divider, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { getDataFromApi } from 'src/utils/apiCalls';
import { convertDateTimeFormat, getDayFromDate } from 'src/utils/common';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import { styled } from '@mui/material/styles';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import Image from 'src/components/image/Image';

const StyledBlock = styled((props) => <Stack direction="row" alignItems="center" {...props} />)({
  minWidth: 72,
  flex: '1 1',
});

const StyledItemIcon = styled(Iconify)(({ theme }) => ({
  width: 16,
  height: 16,
  marginRight: theme.spacing(0.5),
  color: theme.palette.text.disabled,
}));

export default function HolidayBranchList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const getHolidayDetails = () => {
    getDataFromApi(`holiday/list`).then((res) => {
      setLoading(false);
      setData(res.data);
      console.log(res.data, 'data');
    });
  };
  useEffect(() => {
    getHolidayDetails();
  }, []);
  return (
    <>
      <Helmet>
        <title>Holidays | HRMS</title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <Typography variant="h4" gutterBottom>
            Holidays
          </Typography>
        </Stack>
        {loading && <LoadingScreen />}
        {data.length > 0 ? (
          <>
            {!loading && (
              <>
                <Card>
                  <Scrollbar>
                    <Stack spacing={3} sx={{ p: 3 }}>
                      <Typography variant="h6">Lucknow</Typography>
                      {data.map((branch) => (
                        <>
                          {branch.branch.lucknow === true && (
                            <HolidayItem key={branch.id} holiday={branch} />
                          )}
                        </>
                      ))}
                    </Stack>
                  </Scrollbar>
                </Card>
                <Card>
                  <Scrollbar>
                    <Stack spacing={3} sx={{ p: 3 }}>
                      <Typography variant="h6">Bangalore</Typography>
                      {data.map((branch) => (
                        <>
                          {branch.branch.bangalore === true && (
                            <HolidayItem key={branch.id} holiday={branch} />
                          )}
                        </>
                      ))}
                    </Stack>
                  </Scrollbar>
                </Card>
                <Card>
                  <Scrollbar>
                    <Stack spacing={3} sx={{ p: 3 }}>
                      <Typography variant="h6">Delhi</Typography>
                      {data.map((branch) => (
                        <>
                          {branch.branch.delhi === true && (
                            <HolidayItem key={branch.id} holiday={branch} />
                          )}
                        </>
                      ))}
                    </Stack>
                  </Scrollbar>
                </Card>
              </>
            )}
          </>
        ) : (
          <Card>
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                height: 1,
                textAlign: 'center',
                p: (theme) => theme.spacing(5, 2),
              }}
            >
              <Image
                disabledEffect
                alt="empty content"
                src="/assets/illustrations/illustration_empty_content.svg"
                sx={{ height: 240, mb: 3 }}
              />

              <Typography variant="h5" gutterBottom>
                No Holiday
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No Holiday Published here!
              </Typography>
            </Stack>
          </Card>
        )}
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

HolidayItem.propTypes = {
  holiday: PropTypes.shape({
    date: PropTypes.string,
    name: PropTypes.string,
  }),
};

function HolidayItem({ holiday }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <StyledBlock sx={{ minWidth: 120 }}>
        <li>{holiday.name}</li>
      </StyledBlock>
      <StyledBlock>
        {/* <StyledItemIcon icon="ant-design:android-filled" /> */}
        <Typography variant="body2">{convertDateTimeFormat(holiday.date)}</Typography>
      </StyledBlock>

      <StyledBlock>
        {/* <StyledItemIcon icon="ant-design:windows-filled" /> */}
        <Typography variant="body2">{getDayFromDate(holiday.date)}</Typography>
      </StyledBlock>
    </Stack>
  );
}
