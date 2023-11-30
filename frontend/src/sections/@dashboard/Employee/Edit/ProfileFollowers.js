import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
// @mui
import { Box, Card, Button, Typography, Stack, Grid, TextField } from '@mui/material';
// components
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import FormProvider, {
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
} from '../../../../components/hook-form';
import { putDataFromApi } from '../../../../utils/apiCalls';
import { countries } from '../../../../assets/data';

// ----------------------------------------------------------------------

ProfileFollowers.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  setCurrentTab: PropTypes.func,
  currentemployee: PropTypes.object,
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

export default function ProfileFollowers({
  isEdit = false,
  // currentUser,
  setCurrentTab,
  currentemployee,
}) {
  const EmpSchema = Yup.object().shape({
    maritalStatus: Yup.string().required('marital status is required'),
    gender: Yup.string().required('gender is required'),
    personalEmail: Yup.string()
      .required('personal email is required')
      .email('Email must be a valid email address')
      .trim(),
    bloodGroup: Yup.string().required('Blood group is required'),
    DOB: Yup.date()
      .required('DOB is required')
      .typeError('Date of Birth should be a date')
      .max(new Date(), 'Date of Birth cannot be in the future'),
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
    education: Yup.string(),
    percentage: Yup.string(),
    yrOfPassing: Yup.date()
      .typeError('Year Of Passing should be a date')
      .max(new Date(), 'Year Of Passing cannot be in the future'),
  });
  const defaultValues = useMemo(
    () => ({
      empId: currentemployee?.empId || '', // '',
      fatherName: currentemployee?.fatherName || '', // '',
      gender: currentemployee?.gender || '',
      maritalStatus: currentemployee?.maritalStatus || '',
      personalEmail: currentemployee?.personalEmail || '',
      bloodGroup: currentemployee?.bloodGroup || '',
      DOB: currentemployee?.DOB || null, // null,
      aadharNumber: currentemployee?.aadharNumber || '',
      panNumber: currentemployee?.panNumber || '',
      address: currentemployee?.address || '',
      country: currentemployee?.country || '',
      state: currentemployee?.state || '',
      city: currentemployee?.city || '',
      zipCode: currentemployee?.zipCode || '',
      bankName: currentemployee?.bankName || '',
      IFSCCode: currentemployee?.IFSCCode || '',
      bankType: currentemployee?.bankType || '',
      accountNumber: currentemployee?.accountNumber || '',
      education: currentemployee?.education || '',
      percentage: currentemployee?.percentage || '',
      yrOfPassing: currentemployee?.yrOfPassing || null,
      board: currentemployee?.board || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentemployee]
  );

  const [DOBError, setDOBError] = useState('');
  const [yrOfPassingError, setYrOfPassingError] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (currentemployee) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentemployee]);

  const methods = useForm({
    resolver: yupResolver(EmpSchema),
    defaultValues,
  });
  const {
    reset,
    watch,
    resetField,
    setValue,
    handleSubmit,
    formState,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const onSubmit = async (data) => {
    try {
      data.designation = currentemployee.designation;
      await putDataFromApi(`employee/update`, JSON.stringify(data));
      console.log(data, 'data');
      resetField();
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setDOBError(formState.errors.DOB?.message ?? '');
    setYrOfPassingError(formState.errors.yrOfPassing?.message ?? '');
  }, [formState.errors.DOB?.message, formState.errors.yrOfPassing?.message]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                value={values.DOB}
                onChange={(dateDOB) => {
                  setValue('DOB', dateDOB);
                }}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    {...params}
                    error={Boolean(DOBError)}
                    helperText={DOBError}
                  />
                )}
              />
            </Box>
            <Grid item xs={12} mt={2}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Address
              </Typography>
              <Grid
                direction={{ xs: 'column', md: 'row' }}
                spacing={1}
                container
                rowSpacing={2}
                columnSpacing={2}
              >
                <Grid item xs={12} md={4}>
                  {' '}
                  <RHFTextField name="address" label="Address" />
                </Grid>
                <Grid item xs={12} md={4}>
                  {' '}
                  <RHFTextField name="city" label="City" />
                </Grid>
                <Grid item xs={12} md={4}>
                  {' '}
                  <RHFTextField name="state" label="State/Region" />
                </Grid>
                <Grid item xs={12} md={4}>
                  {' '}
                  <RHFSelect native name="country" label="Country" placeholder="Country">
                    <option value="" />
                    {countries.map((country) => (
                      <option key={country.code} value={country.label}>
                        {country.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={4}>
                  {' '}
                  <RHFTextField name="zipCode" label="Zip/Code" type="number" />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} mt={2}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Bank Details
              </Typography>
              <Grid
                direction={{ xs: 'column', md: 'row' }}
                spacing={1}
                container
                rowSpacing={2}
                columnSpacing={2}
              >
                <Grid item xs={12} md={4}>
                  {' '}
                  <RHFTextField name="bankName" label="Bank Name" />
                </Grid>
                <Grid item xs={12} md={4}>
                  {' '}
                  <RHFTextField name="IFSCCode" label="IFSC Code" />
                </Grid>
                <Grid item xs={12} md={4}>
                  {' '}
                  <RHFTextField name="accountNumber" label="Account Number" />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} mt={2}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Highest Education
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
                  <RHFTextField size="small" name="percentage" label="Marks(%)" />
                </Grid>
                <Grid item xs={12} md={4}>
                  {' '}
                  <RHFTextField size="small" name="board" label="Board/University" />
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
                        error={Boolean(yrOfPassingError)}
                        helperText={yrOfPassingError}
                      />
                    )}
                    disableFuture // Disable future dates
                  />
                </Grid>
              </Grid>
            </Grid>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" loading={isSubmitting.toString()}>
                Update Personal Details
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
