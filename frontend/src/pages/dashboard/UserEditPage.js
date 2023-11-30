import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Tab, Card, Tabs, Container, Box } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
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
import {
  Profile,
  ProfileCover,
  ProfileFriends,
  ProfileGallery,
  ProfileFollowers,
} from '../../sections/@dashboard/user/profile';

// ----------------------------------------------------------------------

UserEditPage.propTypes = {
  isEdit: PropTypes.bool,
  // currentUser: PropTypes.object,
  // picker: PropTypes.object,
  onEditRow: PropTypes.func,
};

export default function UserEditPage({ isEdit, onEditRow }) {
  const { themeStretch } = useSettingsContext();

  const { user } = useAuthContext();

  const [searchFriends, setSearchFriends] = useState('');

  const [currentTab, setCurrentTab] = useState('official detail');

  const TABS = [
    {
      value: 'official detail',
      label: 'official detail',
      icon: <Iconify icon="ic:round-account-box" />,
      component: <Profile info={_userAbout} posts={_userFeeds} />,
    },
    {
      value: 'personal detail',
      label: 'personal detail',
      icon: <Iconify icon="ic:round-account-box" />,
      component: <ProfileFollowers followers={_userFollowers} />,
    },
    {
      value: 'professinal detail',
      label: 'professinal detail',
      icon: <Iconify icon="eva:people-fill" />,
      component: (
        <ProfileFriends
          friends={_userFriends}
          searchFriends={searchFriends}
          onSearchFriends={(event) => setSearchFriends(event.target.value)}
        />
      ),
    },
    {
      value: 'Document',
      label: 'Document',
      icon: <Iconify icon="ic:round-perm-media" />,
      component: <ProfileGallery gallery={_userGallery} />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Update User </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Update User"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Users', href: PATH_DASHBOARD.user.root },
            { name: user?.displayName },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
          <ProfileCover name={user?.displayName} role={_userAbout.role} cover={_userAbout.cover} />

          <Tabs
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
        </Card>

        {TABS.map(
          (tab) => tab.value === currentTab && <Box key={tab.value}> {tab.component} </Box>
        )}
      </Container>
    </>
  );
}
