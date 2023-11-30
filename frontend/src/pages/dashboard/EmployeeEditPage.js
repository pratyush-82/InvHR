import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import { Tab, Card, Tabs, Container, Box } from '@mui/material';
// routes
import { useParams } from 'react-router-dom';
import { getDataFromApi } from '../../utils/apiCalls';
import ProfileFollowers from '../../sections/@dashboard/Employee/Edit/ProfileFollowers';
import ProfileFriends from '../../sections/@dashboard/Employee/Edit/ProfileFriends';
import { PATH_DASHBOARD } from '../../routes/paths';
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
import { Profile, ProfileCover, ProfileGallery } from '../../sections/@dashboard/Employee/Edit';
import DocumentUploadPage from '../../sections/@dashboard/Employee/Edit/DocumentUploadPage';

// ----------------------------------------------------------------------

UserEditPage.propTypes = {};

export default function UserEditPage() {
  const [loading, setLoading] = useState(true);
  const [currentemployee, setcurrentemployee] = useState({});
  const { empId } = useParams();
  function getEmployeeById() {
    getDataFromApi(`employee/${empId}`).then((res) => {
      console.log('employeeeditpage employee details', res.data);
      setcurrentemployee(res.data);
      setLoading(false);
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
        <Profile info={_userAbout} posts={_userFeeds} currentemployee={currentemployee} />
      ),
    },
    {
      value: 'personal details',
      label: 'personal',
      icon: <Iconify icon="ic:outline-account-box" />,
      component: currentemployee && (
        <ProfileFollowers followers={_userFollowers} currentemployee={currentemployee} />
      ),
    },
    {
      value: 'professional details',
      label: 'professional',
      icon: <Iconify icon="eva:people-outline" />,
      component: currentemployee && (
        <ProfileFriends
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
        <ProfileGallery gallery={_userGallery} currentemployee={currentemployee} />
        // <DocumentUploadPage />
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Update Employee </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Update Employee"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Employees', href: PATH_DASHBOARD.employee.list },
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
