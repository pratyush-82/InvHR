import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import { Tab, Card, Tabs, Container, Box } from '@mui/material';
// routes
import { getDataFromApi } from '../../utils/apiCalls';
// import ProfileFriends from '../../sections/@dashboard/employee/profile/ProfileFriends';
import { PATH_DASHBOARD } from '../../routes/paths';
// auth
// _mock_
import {
  _userAbout,
  _userFeeds,
  _userFriends,
  _userGallery,
  _userFollowers,
} from '../../_mock/arrays';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import { ProfileCover } from '../../sections/@dashboard/Employee/Edit';
import OfficialDetails from '../../sections/@dashboard/Employee/profile/OfficialDetails';
import PersonalDetails from '../../sections/@dashboard/Employee/profile/PersonalDetails';
import ProfessionalDetails from '../../sections/@dashboard/Employee/profile/ProfessionalDetails';
import DocumentDetails from '../../sections/@dashboard/Employee/profile/DocumentDetails';
import { getLoggedInAdmin } from '../../auth/utils';
// ----------------------------------------------------------------------

EmployeeProfilePage.propTypes = {};

export default function EmployeeProfilePage() {
  const [currentemployee, setcurrentemployee] = useState({});

  const user = getLoggedInAdmin();
  function getEmployeeById() {
    getDataFromApi(`employee/${user.empId}`).then((res) => {
      console.log('employeeeditpage employee details', res.data);
      setcurrentemployee(res.data);
    });
  }
  useEffect(() => {
    getEmployeeById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { themeStretch } = useSettingsContext();

  const [searchFriends, setSearchFriends] = useState('');

  const [currentTab, setCurrentTab] = useState('official details');

  const TABS = [
    {
      value: 'official details',
      label: 'official',
      icon: <Iconify icon="mdi:card-account-details-outline" />,
      component: currentemployee && (
        <OfficialDetails info={_userAbout} posts={_userFeeds} currentemployee={currentemployee} />
      ),
    },
    {
      value: 'personal details',
      label: 'personal',
      icon: <Iconify icon="ic:outline-account-box" />,
      component: currentemployee && (
        <PersonalDetails followers={_userFollowers} currentemployee={currentemployee} />
      ),
    },
    {
      value: 'professional details',
      label: 'professional',
      icon: <Iconify icon="eva:people-fill" />,
      component: currentemployee && (
        <ProfessionalDetails
          friends={_userFriends}
          searchFriends={searchFriends}
          onSearchFriends={(event) => setSearchFriends(event.target.value)}
          currentemployee={currentemployee}
        />
      ),
    },
    {
      value: 'Document details',
      label: 'Document',
      icon: <Iconify icon="ic:outline-perm-media" />,
      component: currentemployee && (
        <DocumentDetails gallery={_userGallery} currentemployee={currentemployee} />
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Profile </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Profile"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: currentemployee?.name },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
          {currentemployee && (
            <ProfileCover
              photoURL={currentemployee?.avatarbase64}
              name={currentemployee?.name}
              role={currentemployee.designationName}
              cover={_userAbout.cover}
            />
          )}
          {currentemployee && (
            <Tabs
              currentemployee={currentemployee}
              value={currentTab}
              onChange={(event, newValue) => setCurrentTab(newValue)}
              sx={{
                width: 1,
                bottom: 0,
                zIndex: 9,
                position: 'absolute',
                bgcolor: 'background.paper',
                '& .MuiTabs-flexContainer': {
                  pr: { md: 3 },
                  justifyContent: {
                    sm: 'center',
                    md: 'flex-end',
                  },
                },
              }}
            >
              {TABS.map((tab) => (
                <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
              ))}
            </Tabs>
          )}
        </Card>

        {TABS.map(
          (tab) =>
            tab.value === currentTab &&
            currentemployee && <Box key={tab.value}> {tab.component} </Box>
        )}
      </Container>
    </>
  );
}
