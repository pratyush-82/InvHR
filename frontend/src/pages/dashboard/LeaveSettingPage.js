import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Tab, Tabs, Container, Box, Stack, Typography } from '@mui/material';
// routes
import { _userAbout, _userFeeds, _userFollowers } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import LeaveTypeListPage from './LeaveTypeListPage';
import LeaveCategoryListPage from './LeaveCategoryListPage';
import { ViewGuard } from '../../auth/MyAuthGuard';

// ----------------------------------------------------------------------

export default function LeaveSettingPage() {
  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('leavetype');

  const TABS = [
    {
      value: 'leavetype',
      label: 'Leave Type',
      component: <LeaveTypeListPage info={_userAbout} posts={_userFeeds} />,
    },
    {
      value: 'leaveCategory',
      label: 'Leave Category',
      component: <LeaveCategoryListPage followers={_userFollowers} />,
    },
  ];

  return (
    <ViewGuard permission="employee.employee.read" page="true">
      <Helmet>
        <title> Leave Setting | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Stack direction="row" alignItems="center" justifyContent="flex-start" sx={{ pb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Leave
          </Typography>
        </Stack>
        <Box
          sx={{
            mb: 3,
            height: 50,
            position: 'relative',
          }}
        >
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              width: 1,
              bottom: 0,
              zIndex: 9,
              ml: 3,
              position: 'absolute',
              bgcolor: 'background.paper',
              '& .MuiTabs-flexContainer': {
                pr: { md: 3 },
                justifyContent: {
                  sm: 'center',
                  md: 'flex-start',
                },
              },
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        {TABS.map(
          (tab) => tab.value === currentTab && <Box key={tab.value}> {tab.component} </Box>
        )}
      </Container>
    </ViewGuard>
  );
}
