/* eslint-disable import/no-unresolved */
/* eslint-disable import/order */
import * as Yup from 'yup';
import PropTypes from 'prop-types';
// @mui
import { Box, Button, Card, Grid, Stack, TextField, Typography } from '@mui/material';
//
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, {
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from 'src/components/hook-form';
import { MuiTelInput } from 'mui-tel-input';
import { DatePicker } from '@mui/x-date-pickers';
import { getDataFromApi, putDataFromApi } from 'src/utils/apiCalls';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { fData } from 'src/utils/formatNumber';
import { isBefore } from 'date-fns';
// ----------------------------------------------------------------------
let USER_SELECTED_PROFILE = null;

const EmployeeType = [
  { label: 'On Probation', value: 'on probation' },
  { label: 'Trainee', value: 'Trainee' },
  { label: 'Full Time Employee', value: 'full time employee' },
];
const branchType = [
  { label: 'Inevitable Electronics', value: 'inevitableElectronics' },
  { label: 'Inevitable Infotech', value: 'inevitableInfotech' },
];

const empStatus = [
  { label: 'Current Employee', value: 'current employee' },
  { label: 'Ex-Employee', value: 'ex-employee' },
];

const locationOfJoining = [
  { label: 'Lucknow', value: 'lucknow' },
  { label: 'Bangalore', value: 'bangalore' },
  { label: 'Delhi', value: 'delhi' },
];

Profile.propTypes = {
  info: PropTypes.object,
  posts: PropTypes.array,
  isEdit: PropTypes.bool,
  currentemployee: PropTypes.object,
  picker: PropTypes.object,
  onEditRow: PropTypes.func,
};

export default function Profile({ currentemployee }) {
  const { enqueueSnackbar } = useSnackbar();

  const [employee, setEmployee] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [DOJError, setDOJError] = useState('');
  const [DORError, setDORError] = useState('');
  const EmpSchema = Yup.object().shape({
    avatarbase64: Yup.string().required('Picture is required'),
    empId: Yup.string().required('EMPID is required'),
    name: Yup.string()
      .required('Name is required')
      .matches(
        /^(?!\d+$)(?:[a-zA-Z0-9,][a-zA-Z0-9 @&,$/-][A-Za-z ]*)?$/,
        ' Name should be a string'
      )
      .typeError('Name must be a string'),
    designation: Yup.string().required('designation is required'),
    empStatus: Yup.string().required('Employee Status is required.'),
    phoneNumber: Yup.string().required('Phone number is required'),
    emergencyContact: Yup.string().required('emergency contact is required'),
    LOJ: Yup.string().required('LOJ is required'),
    reportingPerson: Yup.string().required('Reporting Person is required.'),
    branchType: Yup.string().required('branch is required'),
    employeeType: Yup.string().required('employeeType is required'),
    DOJ: Yup.date()
      .required('DOJ is required')
      .typeError('Date of Joining should be a date')
      .max(new Date(), 'Date of Joining cannot be in the future'),
    DOR: Yup.date()
      .nullable(true)
      .when('empStatus', {
        // eslint-disable-next-line no-shadow
        is: (empStatus) => empStatus !== 'current employee',
        then: Yup.date()
          .required('DOR is required')
          .typeError('Date of Relieving should be a date')
          .max(new Date(), 'Date of Relieving cannot be in the future'),
      }),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    aadharNumber: Yup.string()
      .required('Aadhaar Card is required')
      .test(
        'maxDigits',
        'Aadhaar Card must be exactly 12 digits',
        (aadharNumber) => String(aadharNumber).length === 12
      )
      .min(0, 'It should not contain a negative value')
      .test('isInteger', 'Aadhaar Card should not contain decimal value', (aadharNumber) =>
        Number.isInteger(Number(aadharNumber))
      )
      .typeError('Aadhaar Card must be a number'),
    panNumber: Yup.string()
      .required('PAN is required')
      .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, 'PAN Card Number should be in proper format')
      .min(10, 'PAN Card Number should be exactly 10 digits')
      .max(10, 'PAN Card Number should be exactly 10 digits'),
  });

  const defaultValues = useMemo(
    () => ({
      empId: currentemployee?.empId || '', // '',
      name: currentemployee?.name || '',
      designation: currentemployee?.designation || '', // '',
      email: currentemployee?.email || '', // '',
      empStatus: currentemployee?.empStatus || '', // '',
      phoneNumber: currentemployee?.phoneNumber || '', // null,
      emergencyContact: currentemployee?.emergencyContact || '', // null,
      reportingPerson: currentemployee?.reportingPerson || '',
      branchType: currentemployee?.branchType || '',
      LOJ: currentemployee?.LOJ || '',
      employeeType: currentemployee?.employeeType || '',
      DOJ: currentemployee?.DOJ || null,
      DOR: currentemployee?.DOR || null,
      aadharNumber: currentemployee?.aadharNumber || '',
      panNumber: currentemployee?.panNumber || '',
      avatarbase64: currentemployee?.avatarbase64 || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentemployee]
  );

  const getEmployeeDetails = () => {
    const employeeList = [];
    getDataFromApi(`employee/list`)
      .then((res) => {
        // eslint-disable-next-line array-callback-return
        res.data.map((emp) => {
          if (emp.empStatus === 'current employee') {
            employeeList.push(emp);
          }
        });
        setEmployee(employeeList);
      })
      .catch((err) => console.log(err));
  };

  const getDesignationDetails = () => {
    const designationList = [];
    getDataFromApi(`designation/list`)
      .then((res) => {
        // eslint-disable-next-line array-callback-return
        res.data.map((desg) => {
          if (desg.status === 'active') {
            designationList.push(desg);
          }
        });
        setDesignation(designationList);
        console.log('designation details', designationList);
      })
      .catch((err) => console.log(err));
  };

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
    resetField,
    watch,
    setValue,
    handleSubmit,
    formState,
    formState: { errors, isSubmitting },
  } = methods;

  const values = watch();

  // eslint-disable-next-line arrow-body-style
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      USER_SELECTED_PROFILE = acceptedFiles[0];
      const base64 = await convertBase64(USER_SELECTED_PROFILE);
      if (USER_SELECTED_PROFILE) {
        setValue('avatarbase64', base64, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleBranchChange = async (selected) => {
    setValue('branchType', selected);
    // let code = 'INVE';
    // if (selected.includes('Infotech')) code = 'INVI';
    // const response = await postDataToApi(`employee/empsByIL`, JSON.stringify({ code }));
    // if (response.result) setValue('empId', response.data);
  };
  const onSubmit = async (data) => {
    console.log(data, 'data');
    try {
      await putDataFromApi(`employee/update`, JSON.stringify(data));
      resetField();
      enqueueSnackbar('Update success!');
    } catch (error) {
      enqueueSnackbar(error.message);
      console.log(error, 'error');
    }
  };

  useEffect(() => {
    getEmployeeDetails();
    getDesignationDetails();
  }, []);

  useEffect(() => {
    setDOJError(formState.errors.DOJ?.message ?? '');
    setDORError(formState.errors.DOR?.message ?? '');
  }, [formState.errors.DOJ?.message, formState.errors.DOR?.message]);

  const isDateError =
    values.DOR && values.DOJ ? isBefore(new Date(values.DOR), new Date(values.DOJ)) : false;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Upload Image
              </Typography>
              <RHFUploadAvatar
                name="avatarbase64"
                maxSize={512000}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(512000)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Official Details
            </Typography>

            <Stack spacing={1} sx={{ mb: 1 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Status
              </Typography>

              <RHFRadioGroup row spacing={4} name="empStatus" options={empStatus} />
            </Stack>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFSelect
                native
                name="branchType"
                label="Branch"
                onChange={(e) => handleBranchChange(e.target.value)}
              >
                <option value="" />
                {branchType.map((type, i) => (
                  <option key={i} value={type.label}>
                    {type.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="empId" label="Emp ID" disabled="true" />
              <RHFTextField name="name" label="Name" />
              <RHFSelect native name="designation" label="Designation">
                <option value="" />
                {designation.map((data, j) => (
                  <option key={j} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="email" label="Email Address" disabled="true" />
              <RHFSelect native name="reportingPerson" label="Reporting Person">
                <option value="" />
                {employee.map((data, k) => (
                  <option key={k} value={data.name}>
                    {data.name}
                  </option>
                ))}
              </RHFSelect>{' '}
              <MuiTelInput
                size="small"
                defaultCountry="IN"
                name="phoneNumber"
                value={values.phoneNumber}
                label="Phone Number"
                onChange={(newNumber) => setValue('phoneNumber', newNumber)}
              />
              <MuiTelInput
                size="small"
                defaultCountry="IN"
                name="emergencyContact"
                value={values.emergencyContact}
                label="Emergency Contact Number"
                onChange={(newNumber) => setValue('emergencyContact', newNumber)}
              />
              <RHFTextField name="panNumber" label="PAN Number" />
              <RHFTextField name="aadharNumber" label="Aadhaar Number" />
              <RHFSelect native name="employeeType" label="Employee Type">
                <option value="" />
                {EmployeeType.map((type, m) => (
                  <option key={m} value={type.label}>
                    {type.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect native name="LOJ" label="Joining Location*">
                <option value="" />
                {locationOfJoining.map((type, o) => (
                  <option key={o} value={type.label}>
                    {type.label}
                  </option>
                ))}
              </RHFSelect>
              <DatePicker
                label="Date of Joining"
                inputFormat="dd/MM/yyyy"
                value={values.DOJ}
                onChange={(dateDOJ) => {
                  console.log(dateDOJ);
                  setValue('DOJ', dateDOJ);
                }}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    {...params}
                    error={Boolean(DOJError)}
                    helperText={DOJError}
                  />
                )}
              />
              {values.empStatus.replace(/ /, '') !== 'currentemployee' ? (
                <DatePicker
                  label="Date of Relieving"
                  inputFormat="dd/MM/yyyy"
                  value={values.DOR ? values.DOR : null}
                  onChange={(dateDOR) => {
                    setValue('DOR', dateDOR);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      error={!!isDateError || DORError}
                      helperText={
                        (isDateError && 'Relieving date must be later than Joining date') ||
                        DORError
                      }
                    />
                  )}
                />
              ) : (
                ''
              )}
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" loading={isSubmitting.toString()}>
                Update Official Details
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
