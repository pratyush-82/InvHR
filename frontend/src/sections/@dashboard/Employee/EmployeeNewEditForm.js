/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  Divider,
  TextField,
  Button,
  CardHeader,
  CardContent,
} from '@mui/material';
// utils
import { DatePicker } from '@mui/x-date-pickers';
import { MuiTelInput } from 'mui-tel-input';
import { Upload } from '../../../components/upload';
import Iconify from '../../../components/iconify/Iconify';
import { getDataFromApi, postDataToApi, putDataFromApi } from '../../../utils/apiCalls';
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// assets
import { countries } from '../../../assets/data';
// components
import Label from '../../../components/label';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFRadioGroup,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------
let USER_SELECTED_PROFILE = null;
let AADHAAR_SELECTED_FILE = null;
let PAN_SELECTED_FILE = null;

const gender = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];
const empStatus = [
  { label: 'Current Employee', value: 'current employee' },
  { label: 'Ex Employee', value: 'ex employee' },
];
const maritalStatus = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];
const EmployeeType = [
  { label: 'permanent', value: 'permanent' },
  { label: 'temporary', value: 'temporary' },
];

EmployeeNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  picker: PropTypes.object,
  onEditRow: PropTypes.func,
};

export default function EmployeeNewEditForm({ isEdit = false, currentUser, onEditRow }) {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [DOB, setDOB] = useState('');
  const [DOR, setDOR] = useState('');
  const [DOJ, setDOJ] = useState('');
  const [employee, setEmployee] = useState([]);
  const [openUploadFile, setOpenUploadFile] = useState(false);
  const [aadhaar, setAadhaar] = useState(null);
  const [pan, setPan] = useState(null);
  // const [PANFile, setPANFile] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const { EmpId } = useParams();
  console.log('93', EmpId);
  const EmpSchema = Yup.object().shape({
    empId: Yup.string().required('EMPID is required'),
    name: Yup.string().required('Name is required'),
    designation: Yup.string().required('designation is required'),
    empStatus: Yup.string().required('status is required'),
    maritalStatus: Yup.string().required('marital status is required'),
    gender: Yup.string().required('gender is required'),
    personalEmail: Yup.string().required('personal email is required'),
    emergencyContact: Yup.string().required('emergency contact is required'),
    bloodGroup: Yup.string().required('Nablood group is required'),
    reportingPerson: Yup.string().required('reporting person is required'),
    LOJ: Yup.string().required('LOJ is required'),
    experience: Yup.string().required('experience is required'),
    branch: Yup.string().required('branch is required'),
    employeeType: Yup.string().required('employeeType is required'),
    DOJ: Yup.string().required('DOJ is required'),
    DOB: Yup.string().required('DOB is required'),
    DOR: Yup.string().required('DOR is required'),
    aadharNumber: Yup.string().required('aadhar is required'),
    panNumber: Yup.string().required('pan is required'),
    fatherName: Yup.string().required('father name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('zipCode is required'),
    avatarbase64: Yup.string().required('Avatar is required').nullable(true),
    bankName: Yup.string(),
    IFSCCode: Yup.string(),
    bankType: Yup.string(),
    accountNumber: Yup.string(),
    aadhaarCard: Yup.string().nullable(true),
  });

  const defaultValues = useMemo(
    () => ({
      empId: currentUser?.empId || '',
      name: currentUser?.name || '',
      designation: currentUser?.designation || '',
      fatherName: currentUser?.fatherName || '',
      email: currentUser?.email || '',
      empStatus: currentUser?.empStatus || '',
      gender: currentUser?.gender || '',
      maritalStatus: currentUser?.maritalStatus || '',
      personalEmail: currentUser?.personalEmail || '',
      phoneNumber: currentUser?.phoneNumber || '',
      emergencyContact: currentUser?.emergencyContact || '',
      bloodGroup: currentUser?.bloodGroup || '',
      reportingPerson: currentUser?.reportingPerson || '',
      branch: currentUser?.branch || '',
      LOJ: currentUser?.LOJ || '',
      experience: currentUser?.experience || '',
      employeeType: currentUser?.employeeType || '',
      DOR: currentUser?.DOR || '',
      DOB: currentUser?.DOB || '',
      DOJ: currentUser?.DOJ || '',
      aadharNumber: currentUser?.aadharNumber || '',
      panNumber: currentUser?.panNumber || '',
      address: currentUser?.address || '',
      country: currentUser?.country || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      zipCode: currentUser?.zipCode || '',
      avatarbase64: currentUser?.avatarbase64 || '',
      bankName: currentUser?.bankName || '',
      IFSCCode: currentUser?.IFSCCode || '',
      bankType: currentUser?.bankType || '',
      accountNumber: currentUser?.accountNumber || '',
      aadhaarCard: currentUser?.aadhaarCard || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const handlePhoneChange = (newNumber) => {
    setPhoneNumber(newNumber);
    setValue('phoneNumber', newNumber);
  };
  const handleEmergencyNoChange = (newENumber) => {
    setEmergencyContact(newENumber);
    setValue('emergencyContact', newENumber);
  };

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

  useEffect(() => {
    getEmployeeById();
    if (isEdit && currentUser) {
      defaultValues.name = employee.name;
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  function getEmployeeById() {
    getDataFromApi(`employee/${EmpId}`).then((res) => {
      setEmployee('224', res.data);
      Object.keys(res.data).forEach((item) => setValue(item, res.data[item]));
      setValue('aadhaarCard', res.data.aadhaarCard);
      console.log('employee details', res);
    });
  }

  const convertDate = (date) => {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();

    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;

    return `${dd}/${mm}/${yyyy}`;
  };

  const convertDORDate = (DORDate) => {
    const yyyy = DORDate.getFullYear();
    let mm = DORDate.getMonth() + 1; // Months start at 0!
    let dd = DORDate.getDate();

    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;

    return `${dd}/${mm}/${yyyy}`;
  };

  const convertDOJDate = (DOJDate) => {
    const yyyy = DOJDate.getFullYear();
    let mm = DOJDate.getMonth() + 1; // Months start at 0!
    let dd = DOJDate.getDate();

    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;

    return `${dd}/${mm}/${yyyy}`;
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

  const handleDropAadhaarFile = useCallback(
    async (aadhaarFile) => {
      AADHAAR_SELECTED_FILE = aadhaarFile[0];
      console.log('AADHAAR', AADHAAR_SELECTED_FILE);
      const AadhaarCard = await convertBase64(AADHAAR_SELECTED_FILE);
      console.log('AadhaarCard', AadhaarCard);
      if (AADHAAR_SELECTED_FILE) {
        setValue('aadhaarCard', AadhaarCard, { shouldValidate: true });
      }
      if (AADHAAR_SELECTED_FILE) {
        setAadhaar(
          Object.assign(AADHAAR_SELECTED_FILE, {
            preview: URL.createObjectURL(AADHAAR_SELECTED_FILE),
          })
        );
      }
    },
    [setValue]
  );

  const handleDropPANFile = useCallback(
    async (panFile) => {
      PAN_SELECTED_FILE = panFile[0];
      const PanCard = await convertBase64(PAN_SELECTED_FILE);
      if (PAN_SELECTED_FILE) {
        setValue('PANCard', PanCard, { shouldValidate: true });
      }
      if (PAN_SELECTED_FILE) {
        setPan(
          Object.assign(PAN_SELECTED_FILE, {
            preview: URL.createObjectURL(PAN_SELECTED_FILE),
          })
        );
      }
    },
    [setValue]
  );

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

  const onSubmit = async (data) => {
    if (isEdit) {
      await putDataFromApi(`employee/update`, JSON.stringify(data));
    }
    reset();
    enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
    navigate(PATH_DASHBOARD.employee.list);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {isEdit && (
              <Label
                color={values.empStatus === 'current employee' ? 'success' : 'error'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.empStatus}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Upload Image
              </Typography>
              <RHFUploadAvatar
                name="avatarbase64"
                maxSize={3145728}
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
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {/* {isEdit && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )} */}

            {/* <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            /> */}
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
              
              <RHFTextField name="empId" label="Emp Id" />
              <RHFTextField name="designation" label="Designation" />
              <DatePicker
                label="Date of Joining"
                value={values.DOJ}
                onChange={(dateDOJ) => {
                  setValue('DOJ', convertDOJDate(dateDOJ).split(',')[0]);
                  setDOJ(dateDOJ);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="reportingPerson" label="Reporting Person" />
              <RHFTextField name="experience" label="Experience" />
              <RHFTextField name="branch" label="Branch" />
              {/* <RHFTextField name="employeeType" label="Empolyee Type" /> */}
              <RHFSelect native name="employeeType" label="employee Type">
                <option value="" />
                {EmployeeType.map((type, i) => (
                  <option key={i} value={type.label}>
                    {type.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="LOJ" label="Location of Joining" />

              <DatePicker
                label="Date of Relieving"
                value={values.DOR}
                onChange={(dateDOR) => {
                  setValue('DOR', convertDORDate(dateDOR).split(',')[0]);
                  setDOR(dateDOR);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ pt: 4, pb: 5, px: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Personal Details
            </Typography>
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
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="fatherName" label="Father Name" />
              <RHFTextField name="personalEmail" label="Personal Email" />
              <MuiTelInput
                defaultCountry="IN"
                name="phoneNumber"
                value={values.phoneNumber}
                label="Phone Number"
                onChange={handlePhoneChange}
              />
              <MuiTelInput
                defaultCountry="IN"
                name="emergencyContact"
                value={values.emergencyContact}
                label="Emergency Contact Number"
                onChange={handleEmergencyNoChange}
              />
              <RHFTextField name="bloodGroup" label="Blood Group" />
              <DatePicker
                label="Date of Birth"
                value={values.DOB}
                onChange={(dateDOB) => {
                  setValue('DOB', convertDate(dateDOB).split(',')[0]);
                  setDOB(dateDOB);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <RHFTextField name="panNumber" label="Pan Number" />
              <RHFTextField name="aadharNumber" label="Aadhaar Number" />
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
              <RHFTextField name="zipCode" label="Zip/Code" />
            </Box>
          </Card>
        </Grid>

        {isEdit && (
          <Grid item xs={12}>
            <Card sx={{ pt: 4, pb: 5, px: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Bank Details
              </Typography>

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                <RHFTextField name="bankName" label="Bank Name" />
                <RHFTextField name="IFSCCode" label="IFSC Code" />
                <RHFTextField name="bankType" label="Bank Type" />
                <RHFTextField name="accountNumber" label="Account Number" />
              </Box>
            </Card>
          </Grid>
        )}
        <Grid item xs={12}>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create Employee' : 'Update Employee'}
            </Button>
          </Stack>
        </Grid>
        {isEdit && (
          <Grid item xs={12}>
            <Card sx={{ pt: 4, pb: 5, px: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Document Details
              </Typography>

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                <Stack spacing={1} sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                    Aaadhar Card
                  </Typography>
                  <Upload
                    name="aadhaarCard"
                    acceptedFiles={{ accept: '.pdf' }}
                    file={aadhaar}
                    onDrop={handleDropAadhaarFile}
                  />
                </Stack>
                {/* <Stack spacing={1} sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                    PAN Card
                  </Typography>
                  <Upload
                    file={PANFile}
                    onDrop={handleDropPANFile}
                    onDelete={() => setPANFile(null)}
                  />
                </Stack> */}
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>
    </FormProvider>
  );
}
