import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
// @mui
import { Box, Card, Button, Avatar, Typography, Stack, Grid, TextField } from '@mui/material';
// components
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router';
import { DatePicker } from '@mui/x-date-pickers';
import FormProvider, {
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
} from '../../../components/hook-form';
import Iconify from '../../../components/iconify';
import { getDataFromApi, putDataFromApi } from '../../../utils/apiCalls';
import { countries } from '../../../assets/data';

// ----------------------------------------------------------------------

PersonalDetails.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  setCurrentTab: PropTypes.func,
};
const gender = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const maritalStatus = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

export default function PersonalDetails({ isEdit = false, currentUser, setCurrentTab }) {
  const [employee, setEmployee] = useState([]);
  const { EmpId } = useParams();
  console.log('53', EmpId);
  const EmpSchema = Yup.object().shape({
    maritalStatus: Yup.string().required('marital status is required'),
    gender: Yup.string().required('gender is required'),
    personalEmail: Yup.string().required('personal email is required').email('Invalid Email Format').trim(),
    bloodGroup: Yup.string().required('Blood group is required'),
    DOB: Yup.date().required('DOB is required').typeError('Date of Birth should be a date'),

    aadharNumber: Yup.string().required('Aadhar Number is required'),
    panNumber: Yup.string().required('pan is required'),
    fatherName: Yup.string().required('father name is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('zipCode is required'),
    bankName: Yup.string(),
    IFSCCode: Yup.string(),
    bankType: Yup.string(),
    accountNumber: Yup.string(),
    // aadhaarCard: Yup.string().nullable(true),
    education: Yup.string(),
    percentage: Yup.string(),
    yrOfPassing: Yup.date(),
  });
  const defaultValues = useMemo(
    () => ({
      fatherName: currentUser?.fatherName || '', // '',
      gender: currentUser?.gender || '',
      maritalStatus: currentUser?.maritalStatus || '',
      personalEmail: currentUser?.personalEmail || '',
      bloodGroup: currentUser?.bloodGroup || '',
      DOB: currentUser?.DOB || new Date('2023-04-03T18:30:00.000Z'), // null,
      aadharNumber: currentUser?.aadharNumber || '',
      panNumber: currentUser?.panNumber || '',
      address: currentUser?.address || '',
      country: currentUser?.country || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      zipCode: currentUser?.zipCode || '',
      bankName: currentUser?.bankName || '',
      IFSCCode: currentUser?.IFSCCode || '',
      bankType: currentUser?.bankType || '',
      accountNumber: currentUser?.accountNumber || '',
      // aadhaarCard: currentUser?.aadhaarCard || '',
      education: currentUser?.education || '',
      percentage: currentUser?.percentage || '',
      yrOfPassing: currentUser?.yrOfPassing || '',
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
          <Card sx={{ pt: 4, pb: 5, px: 3 }}>
            {/* <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Personal Details
            </Typography> */}
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Stack spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Gender
                </Typography>

                <RHFRadioGroup row spacing={4} name="gender" options={gender} />
              </Stack>
              <Stack spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Marital Status
                </Typography>

                <RHFRadioGroup row spacing={4} name="maritalStatus" options={maritalStatus} />
              </Stack>
              <RHFTextField name="fatherName" label="Father Name" />
              <RHFTextField name="personalEmail" label="Personal Email" />

              <RHFTextField name="bloodGroup" label="Blood Group" />
              <DatePicker
                label="Date of Birth"
                inputFormat="dd/MM/yyyy"
                value={values.DOB ? values.DOB : null}
                onChange={(dateDOB) => {
                  setValue('DOB', dateDOB);
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />

              <RHFSelect native name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((country) => (
                  <option key={country.code} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="state" label="State/Region" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="address" label="Address" />
              <RHFTextField name="zipCode" label="Zip/Code" type="number" />
              <RHFTextField name="bankName" label="Bank Name" />
              <RHFTextField name="IFSCCode" label="IFSC Code" />
              <RHFTextField name="accountNumber" label="Account Number" />
            </Box>
            <Grid item xs={12} mt={2}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Education:
              </Typography>
              <Grid
                direction={{ xs: 'column', md: 'row' }}
                spacing={1}
                container
                rowSpacing={2}
                columnSpacing={2}
              >
                <Grid item xs={12} md={4}>
                  <RHFTextField size="small" name="education" label="Education" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <RHFTextField size="small" name="percentage" label="Percentage(%)" />
                </Grid>

                <Grid item xs={12} md={4}>
                  <DatePicker
                    views={['year']}
                    inputFormat="yyyy"
                    label="Year of Passing"
                    value={values.yrOfPassing}
                    onChange={(passingYear) => {
                      setValue('yrOfPassing', passingYear);
                    }}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        {...params}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Stack display="flex" direction="row" justifyContent="space-between" mt={4}>
              <Button color="inherit" onClick={() => setCurrentTab('official detail')}>
                Back
              </Button>
              <Button variant="contained" onClick={() => setCurrentTab('professinal detail')}>
                Next
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
