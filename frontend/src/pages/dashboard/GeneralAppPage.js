/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

// @mui
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Grid,
  Stack,
  Button,
  Card,
  Typography,
  Dialog,
  FormControlLabel,
  Checkbox,
  IconButton,
  MenuItem,
  Divider,
  Box,
} from '@mui/material';
// auth
import Image from 'src/components/image/Image';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import { getDataFromApi } from 'src/utils/apiCalls';
import { useAuthContext } from '../../auth/useAuthContext';
// _mock_
import {
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
} from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import {
  AppWidget,
  AppWelcome,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
  AppTopInstalledCountries,
} from '../../sections/@dashboard/general/app';
// assets
import { SeoIllustration, CheckOutIllustration } from '../../assets/illustrations';
import { EmployeeDetails } from '../../utils/Bouncer';
import { getLoggedInAdmin } from '../../auth/utils';
// import {
//   BookingIllustration,
//   CheckInIllustration,
//   CheckOutIllustration,
// } from '../../assets/illustrations';
import {
  AnalyticsTasks,
  AnalyticsNewsUpdate,
  AnalyticsOrderTimeline,
  AnalyticsCurrentVisits,
  AnalyticsWebsiteVisits,
  AnalyticsTrafficBySite,
  AnalyticsWidgetSummary,
  AnalyticsCurrentSubject,
  AnalyticsConversionRates,
} from '../../sections/@dashboard/general/analytics';
import Iconify from '../../components/iconify/Iconify';
import AddTODOForm from '../../sections/@dashboard/TODO/AddTODOForm';
import TodoConfirmDialog from '../../components/confirm-dialog/TodoConfirmDialog';

// ----------------------------------------------------------------------

GeneralAppPage.propTypes = {
  gallery: PropTypes.array,
};
export default function GeneralAppPage({ gallery }) {
  const [selectedImage, setSelectedImage] = useState(-1);
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [todoOpen, settodoOpen] = useState(false);
  const [todoFormData, setTodoFormData] = useState(false);

  const [list, setList] = useState([]);
  const [todo, setTodo] = useState({});
  const user = getLoggedInAdmin();
  const [selected, setSelected] = useState(['2']);

  const theme = useTheme();

  const { id } = useParams();
  console.log(id, 'id');

  const { themeStretch } = useSettingsContext();

  // const imagesLightbox = gallery.map((img) => ({
  //   src: img.imageUrl,
  // }));
  // const handleOpenLightbox = (imageUrl) => {
  //   const imageIndex = imagesLightbox.findIndex((image) => image.src === imageUrl);
  //   setSelectedImage(imageIndex);
  // };

  // const handleCloseLightbox = () => {
  //   setSelectedImage(-1);
  // };

  const getTodoList = () => {
    getDataFromApi(`todo/list`).then((res) => {
      console.log(res.data);
      setList(res.data);
    });
  };

  function getTodoListByID() {
    getDataFromApi(`todo/${id}`).then((res) => {
      setTodo(res.data);
    });
  }

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setOpenForm(false);
  };

  const handleOpenModal = () => {
    setOpenForm(true);
    settodoOpen(true);
  };

  const handleCloseModal = () => {
    setOpenForm(false);
  };

  const handleTodoClose = () => {
    setOpenForm(false);
    settodoOpen(false);
    setTodoFormData('');
    setTimeout(() => {
      getTodoList();
    }, 0);
  };

  const handleEditRow = (data) => {
    setTodoFormData(data);
    setOpenForm(true);
    settodoOpen(true);
  };

  const handleDeleteRow = (data) => {
    setTodoFormData(data);
    setOpenConfirm(true);
  };

  const handleClickComplete = (taskId) => {
    const tasksCompleted = selected.includes(taskId)
      ? selected.filter((value) => value !== taskId)
      : [...selected, taskId];

    setSelected(tasksCompleted);
  };

  useEffect(() => {
    getTodoList();
    getTodoListByID();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome
              title={`Welcome back! \n ${user.name}`}
              description='"Hope is the belief in the probability of the possible rather than the necessity of the probable."'
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
              // action={<Button variant="contained">Go Now</Button>}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppFeatured list={_appFeatured} />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Working Hrs in Month"
              percent={2.6}
              total={96}
              chart={{
                colors: [theme.palette.primary.main],
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Leaves in Month"
              percent={50}
              total={4}
              chart={{
                colors: [theme.palette.info.main],
                series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
              }}
              // icon={<CheckOutIllustration />}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Attendance hrs in Month"
              percent={-5}
              total={40}
              chart={{
                colors: [theme.palette.warning.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {/* <AnalyticsTasks
              title="My TODO"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations InviECom' },
                { id: '5', label: 'Sprint Showcase' },
                { id: '6', label: 'Stakeholder Meeting Secomd' },
                { id: '7', label: 'Scoping & Estimations InviHR' },
              ]}
            /> */}
            <Card>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ pb: 3, m: 2 }}
              >
                <Typography variant="h5" component="div" align="center">
                  My TODO
                </Typography>
                <Button
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  variant="contained"
                  onClick={handleOpenModal}
                  // component={RouterLink}
                  // to={PATH_DASHBOARD.designation.new}
                >
                  TODO
                </Button>
              </Stack>
              <Box>
                {list.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    checked={selected.includes(task.id)}
                    onEditRow={() => handleEditRow(task)}
                    onDeleteRow={() => handleDeleteRow(task)}
                    onChange={() => handleClickComplete(task.id)}
                  />
                ))}
              </Box>
            </Card>
            <Dialog fullWidth maxWidth="xs" open={openForm} onClose={handleCloseModal}>
              <AddTODOForm open={todoOpen} row={todoFormData} onClose={handleTodoClose} />
            </Dialog>
            <TodoConfirmDialog row={todoFormData} open={openConfirm} onClose={handleCloseConfirm} />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppAreaInstalled
              title="Effective Hours"
              subheader="Attendance Vs Work-log"
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                series: [
                  {
                    year: '2022',
                    data: [
                      { name: 'Attendance', data: [160, 164, 165, 151, 149, 162, 169, 171, 148, 155, 168, 170] },
                      { name: 'Work-log', data: [110, 134, 113, 156, 147, 162, 169, 177, 145, 150, 170, 175] },
                    ],
                  },
                  {
                    year: '2023',
                    data: [
                      { name: 'Attendance', data: [169, 161, 145, 131, 179, 152, 170, 175, 148, 159, 168, 175] },
                      { name: 'Work-log', data: [169, 154, 153, 146, 177, 152, 169, 177, 145, 150, 170, 175] },
                    ],
                  },
                ],
              }}
            />
          </Grid> */}
          <Grid item xs={12} md={12} lg={12}>
            <Card sx={{ position: 'relative' }}>
              {/* <Image alt="gallery" ratio="1/1" src={imageUrl} onClick={() => onOpenLightbox(imageUrl)} /> */}
              <Image alt="gallery" src="/assets/background/calendar.png" />
            </Card>
          </Grid>

          {/* <Grid item xs={12} lg={8}>
            <AppNewInvoice
              title="New Invoice"
              tableData={_appInvoices}
              tableLabels={[
                { id: 'id', label: 'Invoice ID' },
                { id: 'category', label: 'Category' },
                { id: 'price', label: 'Price' },
                { id: 'status', label: 'Status' },
                { id: '' },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopRelated title="Top Related Applications" list={_appRelated} />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopAuthors title="Top Authors" list={_appAuthors} />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <Stack spacing={3}>
              <AppWidget
                title="Conversion"
                total={38566}
                icon="eva:person-fill"
                chart={{
                  series: 48,
                }}
              />

              <AppWidget
                title="Applications"
                total={55566}
                icon="eva:email-fill"
                color="info"
                chart={{
                  series: 75,
                }}
              />
            </Stack>
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

TaskItem.propTypes = {
  task: PropTypes.object,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  open: PropTypes.bool,
  close: PropTypes.func,
};

function TaskItem({ task, checked, onChange, open, close, onEditRow, onDeleteRow }) {
  const [openPopover, setOpenPopover] = useState(null);
  const [todoFormData, setTodoFormData] = useState(false);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleMarkComplete = () => {
    handleClosePopover();
    console.log('MARK COMPLETE', task.id);
  };

  const handleShare = () => {
    handleClosePopover();
    console.log('SHARE', task.id);
  };

  const handleEdit = (data) => {
    handleClosePopover();
    setTodoFormData(data);
    console.log('EDIT', task.id);
  };

  const handleDelete = (data) => {
    handleClosePopover();
    setTodoFormData(data);
    console.log('DELETE', task.id);
  };

  return (
    <>
      <Stack
        direction="row"
        sx={{
          px: 2,
          py: 0.75,
          ...(checked && {
            color: 'text.disabled',
            textDecoration: 'line-through',
          }),
        }}
      >
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={onChange} />}
          label={task.details}
          sx={{ flexGrow: 1, m: 0 }}
        />

        <IconButton
          size="large"
          color={openPopover ? 'inherit' : 'default'}
          onClick={handleOpenPopover}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top">
        {/* <MenuItem onClick={handleMarkComplete}>
          <Iconify icon="eva:checkmark-circle-2-fill" />
          Mark Complete
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Update
        </MenuItem>

        {/* <MenuItem onClick={handleShare}>
          <Iconify icon="eva:share-fill" />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} /> */}

        <MenuItem
          onClick={() => {
            onDeleteRow();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}
