import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import {
  Box,
  Card,
  Link,
  Stack,
  Avatar,
  MenuItem,
  IconButton,
  Typography,
  InputAdornment,
  Grid,
  TextField,
  Button,
} from '@mui/material';
// _mock
import { useParams } from 'react-router';
import { useFieldArray, useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { yupResolver } from '@hookform/resolvers/yup';
import { getDataFromApi, putDataFromApi } from '../../../utils/apiCalls';
import { _socials } from '../../../_mock/arrays';
// components
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import { CustomTextField } from '../../../components/custom-input';
import SearchNotFound from '../../../components/search-not-found';
import FormProvider, { RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

ProfessionalDetails.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  setCurrentTab: PropTypes.func,
};

export default function ProfessionalDetails({ isEdit = false, currentUser, setCurrentTab }) {
  const [employee, setEmployee] = useState([]);
  const { EmpId } = useParams();
  console.log('53', EmpId);
  const EmpSchema = Yup.object().shape({
    experience: Yup.string().required('experience is required'),
    education: Yup.string(),
    percentage: Yup.string(),
    yrOfPassing: Yup.date(),
  });

  const defaultValues = useMemo(
    () => ({
      technologies: [{ technologyName: '', technologyExp: '', technologyYear: '' }],
      organizations: [{ orgName: '', orgDOJ: '', orgDOR: '' }],
      experience: currentUser?.experience || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(EmpSchema),
    defaultValues,
  });
  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const {
    fields: techFields,
    append: techAppend,
    remove: techRemove,
  } = useFieldArray({
    control,
    name: 'technologies',
  });

  const {
    fields: orgFields,
    append: orgAppend,
    remove: orgRemove,
  } = useFieldArray({ control, name: 'organizations' });

  const values = watch();
  function getEmployeeById() {
    getDataFromApi(`employee/${EmpId}`).then((res) => {
      setEmployee('113', res.data);
      Object.keys(res.data).forEach((item) => setValue(item, res.data[item]));
      setValue('aadhaarCard', res.data.aadhaarCard);
      console.log('employee details', res);
    });
  }
  const onSubmit = async (data) => {
    await putDataFromApi(`employee/update`, JSON.stringify(data));

    reset();
    // enqueueSnackbar('Update success!');
    // navigate(PATH_DASHBOARD.employee.list);
  };

  useEffect(() => {
    getEmployeeById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <RHFTextField name="experience" label="Total Year of Experience" />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Technologies Used:
                </Typography>
                {techFields.map((item, index) => (
                  <Stack key={item.id} spacing={2} mb={2}>
                    <Grid
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={1}
                      container
                      rowSpacing={2}
                      columnSpacing={2}
                    >
                      <Grid item xs={12} md={3}>
                        <RHFTextField
                          size="small"
                          name={`technologies[${index}].technologyName`}
                          label="Technology Name / Version"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <DatePicker
                          name={`technologies[${index}].technologyYear`}
                          onChange={(selected) =>
                            setValue(`technologies[${index}].technologyYear`, selected)
                          }
                          value={
                            values.technologies[index].technologyYear
                              ? values.technologies[index].technologyYear
                              : null
                          }
                          views={['year']}
                          label="Last Used"
                          inputFormat="yyyy"
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              size="small"
                              {...params}
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <RHFTextField
                          size="small"
                          name={`technologies[${index}].technologyExp`}
                          label="Technology Experience"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      {index > 0 && (
                        <Grid item xs={12} md={3} justifyContent="center">
                          <Box textAlign="center">
                            <Button
                              size="small"
                              color="error"
                              startIcon={<Iconify icon="eva:trash-2-outline" />}
                              onClick={() => techRemove(index)}
                            >
                              Remove
                            </Button>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Stack>
                ))}

                <Grid
                  container
                  spacing={2}
                  direction={{ xs: 'column', md: 'row' }}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                >
                  <Grid item xs={12} mt={1}>
                    <Button
                      size="large"
                      startIcon={<Iconify icon="eva:plus-fill" />}
                      onClick={() =>
                        techAppend({
                          technologyName: '',
                          technologyVersion: '',
                          technologyExp: '',
                        })
                      }
                      sx={{ flexShrink: 0 }}
                    >
                      Add Technology
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Organization:
                </Typography>

                {orgFields.map((data, j) => (
                  <Stack spacing={2} key={data.id}>
                    <Grid
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={1}
                      container
                      rowSpacing={2}
                      columnSpacing={2}
                      mb={3}
                    >
                      <Grid item xs={12} md={3}>
                        <RHFTextField
                          size="small"
                          name={`organizations[${j}].orgName`}
                          label="Organization Name"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <DatePicker
                          label="Date of Joining"
                          inputFormat="dd/MM/yyyy"
                          value={
                            values.organizations[j].orgDOJ ? values.organizations[j].orgDOJ : null
                          }
                          name={`organizations[${j}].orgDOJ`}
                          onChange={(selected) => setValue(`organizations[${j}].orgDOJ`, selected)}
                          renderInput={(params) => <TextField fullWidth size="small" {...params} />}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <DatePicker
                          label="Date of Relieving"
                          inputFormat="dd/MM/yyyy"
                          name={`organizations[${j}].orgDOR`}
                          value={
                            values.organizations[j].orgDOR ? values.organizations[j].orgDOR : null
                          }
                          onChange={(selected) => setValue(`organizations[${j}].orgDOR`, selected)}
                          renderInput={(params) => <TextField fullWidth size="small" {...params} />}
                        />
                      </Grid>
                      {j > 0 && (
                        <Grid item xs={12} md={3}>
                          <Box textAlign="center">
                            <Button
                              size="small"
                              color="error"
                              startIcon={<Iconify icon="eva:trash-2-outline" />}
                              onClick={() => orgRemove(j)}
                            >
                              Remove
                            </Button>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Stack>
                ))}

                <Grid
                  container
                  spacing={2}
                  direction={{ xs: 'column', md: 'row' }}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                >
                  <Grid item xs={12} mt={1}>
                    <Button
                      size="large"
                      startIcon={<Iconify icon="eva:plus-fill" />}
                      onClick={() => orgAppend({ orgName: '', orgDOJ: '', orgDOR: '' })}
                      sx={{ flexShrink: 0 }}
                    >
                      Add Organization
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Stack display="flex" direction="row" justifyContent="space-between" mt={4}>
              <Button color="inherit" onClick={() => setCurrentTab('personal detail')}>
                Back
              </Button>
              <Button variant="contained" onClick={() => setCurrentTab('document')}>
                Next
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

// ----------------------------------------------------------------------

// FriendCard.propTypes = {
//   friend: PropTypes.object,
// };

// function FriendCard({ friend }) {
//   const { name, role, avatarUrl } = friend;

//   const [openPopover, setOpenPopover] = useState(null);

//   const handleOpenPopover = (event) => {
//     setOpenPopover(event.currentTarget);
//   };

//   const handleClosePopover = () => {
//     setOpenPopover(null);
//   };

//   const handleDelete = () => {
//     handleClosePopover();
//     console.log('DELETE', name);
//   };

//   const handleEdit = () => {
//     handleClosePopover();
//     console.log('EDIT', name);
//   };

//   return (
//     <>
//       <Card
//         sx={{
//           py: 5,
//           display: 'flex',
//           position: 'relative',
//           alignItems: 'center',
//           flexDirection: 'column',
//         }}
//       >
//         <Avatar alt={name} src={avatarUrl} sx={{ width: 64, height: 64, mb: 3 }} />

//         <Link variant="subtitle1" color="text.primary">
//           {name}
//         </Link>

//         <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, mt: 0.5 }}>
//           {role}
//         </Typography>

//         <Stack alignItems="center" justifyContent="center" direction="row">
//           {_socials.map((social) => (
//             <IconButton
//               key={social.name}
//               sx={{
//                 color: social.color,
//                 '&:hover': {
//                   bgcolor: alpha(social.color, 0.08),
//                 },
//               }}
//             >
//               <Iconify icon={social.icon} />
//             </IconButton>
//           ))}
//         </Stack>

//         <IconButton
//           color={openPopover ? 'inherit' : 'default'}
//           onClick={handleOpenPopover}
//           sx={{ top: 8, right: 8, position: 'absolute' }}
//         >
//           <Iconify icon="eva:more-vertical-fill" />
//         </IconButton>
//       </Card>

//       <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top">
//         <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
//           <Iconify icon="eva:trash-2-outline" />
//           Delete
//         </MenuItem>

//         <MenuItem onClick={handleEdit}>
//           <Iconify icon="eva:edit-fill" />
//           Edit
//         </MenuItem>
//       </MenuPopover>
//     </>
//   );
// }

// // ----------------------------------------------------------------------

// function applyFilter(inputData, query) {
//   if (query) {
//     return inputData.filter(
//       (friend) => friend.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
//     );
//   }

//   return inputData;
// }
