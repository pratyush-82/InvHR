/* eslint-disable react/jsx-no-duplicate-props */
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
// @mui
import {
  Box,
  Step,
  Paper,
  Button,
  Stepper,
  StepLabel,
  Typography,
  Grid,
  Card,
  Stack,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from '@mui/x-date-pickers';
import { MuiTelInput } from 'mui-tel-input';
import { isBefore } from 'date-fns';
import Iconify from '../../../components/iconify/Iconify';
import { getDataFromApi, postDataToApi } from '../../../utils/apiCalls';
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import { countries } from '../../../assets/data';
import FormProvider, {
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from '../../../components/hook-form';
import { useSnackbar } from '../../../components/snackbar';
import { formatDate } from '../../../utils/common';
// ----------------------------------------------------------------------

let USER_SELECTED_PROFILE = null;

const steps = [
  'Official Information',
  'Professional Information',
  // 'Document',
  'Personal Information',
];

const locationOfJoining = [
  { label: 'Lucknow', value: 'lucknow' },
  { label: 'Bangalore', value: 'bangalore' },
  { label: 'Delhi', value: 'delhi' },
];

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

const gender = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const maritalStatus = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

AddNewEmployeeForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  picker: PropTypes.object,
  onEditRow: PropTypes.func,
};

export default function AddNewEmployeeForm(isEdit = false, currentUser, onEditRow) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  // const [CurrentErrors, setCurrentErrors] = useState([]);
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [emergencyContactError, setEmergencyContactError] = useState('');
  const [empStatusError, setEmpStatusError] = useState('');
  const [DOJError, setDOJError] = useState('');
  const [DORError, setDORError] = useState('');
  const [DOBError, setDOBError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [employee, setEmployee] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [open, setOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancelClose = () => {
    // navigate(PATH_DASHBOARD.employee.list);
    setCancelOpen(false);
  };

  const handleDateChange = (date) => {
    setDOBDate(date);
    const formattedDate = formatDate(date);
    setValue('DOB', formattedDate);
  };

  const { enqueueSnackbar } = useSnackbar();
  const EmpSchema = Yup.object().shape({
    avatarbase64: Yup.string().required('Picture is required'),
    empStatus: Yup.string().required('Emp Status is required'),
    branchType: Yup.string().required('Branch is required'),
    empId: Yup.string().required('Employee ID is required'),
    name: Yup.string()
      .required('Name is required')
      .matches(
        /^(?!\d+$)(?:[a-zA-Z0-9,][a-zA-Z0-9 @&,$/-][A-Za-z ]*)?$/,
        ' Name should be a string'
      )
      .typeError('Name must be a string'),
    designation: Yup.string().required('Designation is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    reportingPerson: Yup.string().required('Reporting Person is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    emergencyContact: Yup.string().required('Emergency Contact is required'),
    panNumber: Yup.string()
      .required('PAN is required')
      .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, 'PAN Card Number should be in proper format')
      .min(10, 'PAN Card Number should be exactly 10 digits')
      .max(10, 'PAN Card Number should be exactly 10 digits'),
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
    employeeType: Yup.string().required('EmployeeType is required'),
    LOJ: Yup.string().required('Location of Joining is required'),
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
    gender: Yup.string(),
    maritalStatus: Yup.string(),
    personalEmail: Yup.string().email('Email must be a valid email address'),
    experience: Yup.string(),
  });
  Yup.object().when('step1', {
    is: true,
    then: Yup.object().shape({
      technologies: Yup.array().of(
        Yup.object().shape({
          technologyExp: Yup.number()
            .min(0, 'Technology Experience cannot be negative')
            .max(
              Yup.ref('experience'),
              'Technology Experience cannot be greater than Total Year of Experience'
            ),
          // .required('Technology Experience is required'),
        })
      ),
    }),
  });

  Yup.object().when('step2', {
    is: true,
    then: Yup.object().shape({
      DOB: Yup.date().nullable(true).required('DOB is required'),
      fatherName: Yup.string().required("Father's name is required."),
      address: Yup.string().required('Address is required.'),
      country: Yup.string().required('Country is required.'),
      state: Yup.string().required('State is required.'),
      city: Yup.string().required('City is required.'),
      zipCode: Yup.string().required('Zip code is required.'),
      bankName: Yup.string().required('Bank name is required.'),
      IFSCCode: Yup.string().required('IFSC code is required.'),
      bankType: Yup.string().required('Bank type is required.'),
      accountNumber: Yup.string().required('Account number is required.'),
      education: Yup.string().required('Education is required.'),
      board: Yup.string().required('Board is required.'),
      percentage: Yup.string().required('Percentage is required.'),
      yrOfPassing: Yup.date().nullable(true).required('Year of passing is required.'),
    }),
  });

  // Combine the schemas if you have multiple steps
  // const EmpSchema = Yup.object().shape({
  //   step0: Yup.boolean().required(),
  //   step1: Yup.boolean().required(),
  //   step2: Yup.boolean().required(),

  //   avatarbase64: Yup.string().when('step0', {
  //     is: (step0) => step0,
  //     then: Yup.string().required('Picture is required'),
  //   }),
  //   empStatus: Yup.string().when('step0', {
  //     is: (step0) => step0,
  //     then: Yup.string().required('Emp Status is required'),
  //   }),
  //   branchType: Yup.string().when('step0', {
  //     is: (step0) => step0,
  //     then: Yup.string().required('Branch is required'),
  //   }),
  //   empId: Yup.string().when('step0', {
  //     is: (step0) => step0,
  //     then: Yup.string().required('Employee ID is required'),
  //   }),
  //   name: Yup.string().when('step0', {
  //     is: (step0) => step0,
  //     then: Yup.string()
  //       .required('Name is required')
  //       .matches(
  //         /^(?!\d+$)(?:[a-zA-Z0-9,][a-zA-Z0-9 @&,$/-][A-Za-z ]*)?$/,
  //         ' Name should be a string'
  //       )
  //       .typeError('Name must be a string'),
  //   }),
  //   designation: Yup.string().when('step0', {
  //     is: (step0) => step0,
  //     then: Yup.string().required('Designation is required'),
  //   }),
  //   email: Yup.string().when('step0', {
  //     is: (step0) => step0,
  //     then: Yup.string().required('Email is required').email('Email must be a valid email address'),
  //   }),
  //   reportingPerson: Yup.string().when('step0', {
  //     is: (step0) => step0,
  //     then: Yup.string().required('Reporting Person is required'),
  //   }),
  //   phoneNumber: Yup.string().when('step0', {
  //     is: (step0) => step0,
  //     then: Yup.string().required('Phone Number is required'),
  //   }),
  //   emergencyContact: Yup.string().when('step0', {
  //     is: (step0) => step0,
  //     then: Yup.string().required('Emergency Contact is required'),
  //   }),
  //   panNumber: Yup.string().when('step0', {
  //     is: (step0) => step0,
  //     then: Yup.string()
  //       .required('PAN is required')
  //       .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, 'PAN Card Number should be in proper format')
  //       .min(10, 'PAN Card Number should be exactly 10 digits')
  //       .max(10, 'PAN Card Number should be exactly 10 digits'),
  //   }),
  //   aadharNumber: Yup.string().when('step0', {
  //     is: (step0) => step0,
  //     then: Yup.string()
  //       .required('Aadhaar Card is required')
  //       .test(
  //         'maxDigits',
  //         'Aadhaar Card must be exactly 12 digits',
  //         (aadharNumber) => String(aadharNumber).length === 12
  //       )
  //       .min(0, 'It should not contain a negative value')
  //       .test('isInteger', 'Aadhaar Card should not contain decimal value', (aadharNumber) =>
  //         Number.isInteger(Number(aadharNumber))
  //       )
  //       .typeError('Aadhaar Card must be a number'),
  //   }),
  //   employeeType: Yup.string().when('step0', {
  //     is: (step0) => step0,
  //     then: Yup.string().required('Employee Type is required'),
  //   }),
  //   LOJ: Yup.string().when('step0', {
  //     is: (step0) => step0,
  //     then: Yup.string().required('Location of Joining is required'),
  //   }),
  //   DOJ: Yup.date().when('step0', {
  //     is: (step0) => step0,
  //     then: Yup.date()
  //       .required('DOJ is required')
  //       .typeError('Date of Joining should be a date')
  //       .max(new Date(), 'Date of Joining cannot be in the future'),
  //   }),
  //   DOR: Yup.date()
  //     .nullable(true)
  //     .when(['step0', 'empStatus'], {
  //       // eslint-disable-next-line no-shadow
  //       is: (step0, empStatus) => step0 && empStatus !== 'current employee',
  //       then: Yup.date()
  //         .nullable(true)
  //         .required('Date of Relieving is required')
  //         .typeError('Date of Relieving should be a date')
  //         .max(new Date(), 'Date of Relieving cannot be in the future.'),
  //     }),

  //   experience: Yup.number().when('step1', {
  //     is: (step1) => step1,
  //     then: Yup.number(),
  //   }),

  //   // technologies: Yup.array()
  //   //   .when('step1', {
  //   //     is: (step1) => step1,
  //   //     then: Yup.array().of(
  //   //       Yup.object().shape({
  //   //         technologyExp: Yup.string()
  //   //           .min(0, 'technology experience cannot be negative')
  //   //           .when('experience', (experience, schema) => {
  //   //             console.log(`Yup validation running with experience ${experience}`);
  //   //             return schema.max(
  //   //               // eslint-disable-next-line radix
  //   //               parseInt(experience) ?? 1,
  //   //               'Technology Experience cannot be greater than Total year of experience'
  //   //             );
  //   //           }),
  //   //       })
  //   //     ),
  //   //   })
  //   //   .default([]), // You might want to set a default empty array if 'step2' is not truthy.

  //   DOB: Yup.date()
  //     .nullable(true)
  //     .when('step2', {
  //       is: (step2) => step2,
  //       then: Yup.date().nullable(true).required('DOB is required'),
  //     }),
  //   fatherName: Yup.string().when('step2', {
  //     is: (step2) => step2,
  //     then: Yup.string(),
  //   }),
  //   address: Yup.string().when('step2', {
  //     is: (step2) => step2,
  //     then: Yup.string(),
  //   }),
  //   country: Yup.string().when('step2', {
  //     is: (step2) => step2,
  //     then: Yup.string(),
  //   }),
  //   state: Yup.string().when('step2', {
  //     is: (step2) => step2,
  //     then: Yup.string(),
  //   }),
  //   city: Yup.string().when('step2', {
  //     is: (step2) => step2,
  //     then: Yup.string(),
  //   }),
  //   zipCode: Yup.string().when('step2', {
  //     is: (step2) => step2,
  //     then: Yup.string(),
  //   }),
  //   bankName: Yup.string().when('step2', {
  //     is: (step2) => step2,
  //     then: Yup.string(),
  //   }),
  //   IFSCCode: Yup.string().when('step2', {
  //     is: (step2) => step2,
  //     then: Yup.string(),
  //   }),
  //   bankType: Yup.string().when('step2', {
  //     is: (step2) => step2,
  //     then: Yup.string(),
  //   }),
  //   accountNumber: Yup.string().when('step2', {
  //     is: (step2) => step2,
  //     then: Yup.string(),
  //   }),
  //   education: Yup.string().when('step2', {
  //     is: (step2) => step2,
  //     then: Yup.string(),
  //   }),
  //   board: Yup.string().when('step2', {
  //     is: (step2) => step2,
  //     then: Yup.string(),
  //   }),
  //   percentage: Yup.string().when('step2', {
  //     is: (step2) => step2,
  //     then: Yup.string(),
  //   }),
  //   yrOfPassing: Yup.date()
  //     .nullable(true)
  //     .when('step2', {
  //       is: (step2) => step2,
  //       then: Yup.date(),
  //     }),
  // });

  const defaultValues = useMemo(
    () => ({
      step0: false,
      step1: false,
      step2: false,
      technologies: [{ technologyName: '', technologyExp: '', technologyYear: '' }],
      organizations: [{ orgName: '', orgDOJ: '', orgDOR: '' }],
      empId: currentUser?.empId || '', // '',
      name: currentUser?.name || '',
      designation: currentUser?.designation || '', // '',
      fatherName: currentUser?.fatherName || '', // '',
      email: currentUser?.email || '', // '',
      empStatus: currentUser?.empStatus || '', // '',
      gender: currentUser?.gender || '',
      maritalStatus: currentUser?.maritalStatus || '',
      personalEmail: currentUser?.personalEmail || '',
      phoneNumber: currentUser?.phoneNumber || '', // null,
      emergencyContact: currentUser?.emergencyContact || '', // null,
      bloodGroup: currentUser?.bloodGroup || '',
      reportingPerson: currentUser?.reportingPerson || '',
      branchType: currentUser?.branchType || '',
      LOJ: currentUser?.LOJ || '',
      experience: currentUser?.experience || '0',
      employeeType: currentUser?.employeeType || '',
      DOJ: currentUser?.DOJ || null,
      DOR: currentUser?.DOR || null,
      DOB: currentUser?.DOB || null,
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
      education: currentUser?.education || '',
      board: currentUser?.board || '',
      percentage: currentUser?.percentage || '',
      yrOfPassing: currentUser?.yrOfPassing || null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(EmpSchema),
    defaultValues,
  });

  const [DOBDate, setDOBDate] = useState(defaultValues.DOB ? new Date(defaultValues.DOB) : null);
  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState,
    formState: { errors },
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
    let code = 'INVE';
    if (selected.includes('Infotech')) code = 'INVI';
    const response = await postDataToApi(`employee/empsByIL`, JSON.stringify({ code }));
    if (response.result) setValue('empId', response.data);
  };

  const isStepOptional = (step) => step === 1;

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = async (e) => {
    // e.preventDefault();
    console.log('function');
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = (e) => {
    e.preventDefault();
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  // const isNextButtonDisable = () => Boolean(CurrentErrors.name);

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

  const onSubmit = async (data) => {
    console.log(data);
    const response = await postDataToApi(`employee/create`, JSON.stringify(data));
    if (response.result) {
      reset();
      enqueueSnackbar('Create success!');
      navigate(PATH_DASHBOARD.employee.list);
    } else {
      console.log(response);
      enqueueSnackbar(response.message, { variant: 'error' });
      // setCurrentErrors([response.message]);
    }
  };

  useEffect(() => {
    getEmployeeDetails();
    getDesignationDetails();
  }, []);

  useEffect(() => {
    setPhoneNumberError(formState.errors.phoneNumber?.message ?? '');
    setEmergencyContactError(formState.errors.emergencyContact?.message ?? '');
    setEmpStatusError(formState.errors.empStatus?.message ?? '');
    setDOJError(formState.errors.DOJ?.message ?? '');
    setDORError(formState.errors.DOR?.message ?? '');
    // setDOBError(formState.errors.DOB?.message ?? '');
    setGenderError(formState.errors.gender?.message ?? '');
  }, [
    formState.errors.DOJ?.message,
    formState.errors.DOR?.message,
    formState.errors.emergencyContact?.message,
    formState.errors.empStatus?.message,
    formState.errors.gender?.message,
    formState.errors.phoneNumber?.message,
  ]);

  useEffect(() => {
    setValue('step0', activeStep === 0);
    setValue('step1', activeStep === 1);
    setValue('step2', activeStep === 2);
  }, [activeStep, setValue]);

  const isDateError =
    values.DOR && values.DOJ ? isBefore(new Date(values.DOR), new Date(values.DOJ)) : false;

  /**
   * If the age is less than 18, then set the value of the dob field to null and set the error message.
   * @param value - The value of the field.
   */
  const getDob = (value) => {
    let age = null;
    const today = new Date();
    const day = value;
    age = today.getFullYear() - (value == null ? 0 : day.getFullYear());

    if (age < 18) {
      setDOBError('Age should be greater than 18');
      setValue('DOB', null);
    } else {
      setDOBError('');
      setValue('DOB', value.toDateString());
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleNext)}>
      {/* {JSON.stringify(formState.errors)} */}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <>
        {/* {
          CurrentErrors?.map((errorItem, n) => ( */}
        <Box>
          {activeStep === 0 && (
            <Paper
              sx={{
                p: 3,
                my: 3,
                minHeight: 120,
              }}
            >
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
                    <Stack spacing={1} sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Status*
                      </Typography>
                      <RHFRadioGroup
                        row
                        spacing={4}
                        name="empStatus"
                        options={empStatus}
                        error={Boolean(empStatusError)}
                        helperText={empStatusError}
                      />
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
                        label="Branch*"
                        onChange={(e) => handleBranchChange(e.target.value)}
                      >
                        <option value="" />
                        {branchType.map((type, i) => (
                          <option key={i} value={type.label}>
                            {type.label}
                          </option>
                        ))}
                      </RHFSelect>
                      <RHFTextField name="empId" label="Emp ID*" />
                      <RHFTextField name="name" label="Full Name*" />
                      <RHFSelect native name="designation" label="Designation*">
                        <option value="" />
                        {designation.map((data, j) => (
                          <option key={j} value={data.id}>
                            {data.name}
                          </option>
                        ))}
                      </RHFSelect>
                      <RHFTextField name="email" label="Email Address*" />
                      <RHFSelect native name="reportingPerson" label="Reporting Person*">
                        <option value="" />
                        {employee.map((data, k) => (
                          <option key={k} value={data.name}>
                            {data.name}
                          </option>
                        ))}
                      </RHFSelect>
                      <MuiTelInput
                        size="small"
                        defaultCountry="IN"
                        name="phoneNumber"
                        value={values.phoneNumber}
                        label="Phone Number*"
                        onChange={(newNumber) => setValue('phoneNumber', newNumber)}
                        error={Boolean(phoneNumberError)}
                        helperText={phoneNumberError}
                      />
                      <MuiTelInput
                        size="small"
                        defaultCountry="IN"
                        name="emergencyContact"
                        value={values.emergencyContact}
                        label="Emergency Contact Number*"
                        onChange={(newNumber) => setValue('emergencyContact', newNumber)}
                        error={Boolean(emergencyContactError)}
                        helperText={emergencyContactError}
                      />
                      <RHFTextField name="panNumber" label="PAN Number*" />
                      <RHFTextField name="aadharNumber" label="Aadhaar Number*" />

                      <RHFSelect native name="employeeType" label="Employee Type*">
                        <option value="" />
                        {EmployeeType.map((type, l) => (
                          <option key={l} value={type.label}>
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
                        label="Date of Joining*"
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
                          label="Date of Relieving*"
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
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          )}
          {activeStep === 1 && (
            <Paper
              sx={{
                p: 3,
                my: 3,
                minHeight: 120,
              }}
            >
              <Box>
                <Card sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <RHFTextField name="experience" label="Total Year of Experience" />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 3 }}>
                        Technologies Used
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
                                disableFuture // Disable future dates
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
                        Organization
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
                                  values.organizations[j].orgDOJ
                                    ? values.organizations[j].orgDOJ
                                    : null
                                }
                                name={`organizations[${j}].orgDOJ`}
                                onChange={(selected) =>
                                  setValue(`organizations[${j}].orgDOJ`, selected)
                                }
                                renderInput={(params) => (
                                  <TextField fullWidth size="small" {...params} />
                                )}
                                disableFuture // Disable future dates
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <DatePicker
                                label="Date of Relieving"
                                inputFormat="dd/MM/yyyy"
                                name={`organizations[${j}].orgDOR`}
                                value={
                                  values.organizations[j].orgDOR
                                    ? values.organizations[j].orgDOR
                                    : null
                                }
                                onChange={(selected) =>
                                  setValue(`organizations[${j}].orgDOR`, selected)
                                }
                                renderInput={(params) => (
                                  <TextField fullWidth size="small" {...params} />
                                )}
                                disableFuture // Disable future dates
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
                </Card>
              </Box>
            </Paper>
          )}
          {activeStep === 2 && (
            <Paper
              sx={{
                p: 3,
                mt: 3,
                minHeight: 120,
              }}
            >
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
                    <Stack
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={3}
                    >
                      <Typography variant="subtitle2">Gender</Typography>

                      <RHFRadioGroup
                        row
                        spacing={2}
                        name="gender"
                        options={gender}
                        error={Boolean(genderError)}
                        helperText={genderError}
                      />
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={3}
                    >
                      <Typography variant="subtitle2">Marital Status</Typography>

                      <RHFRadioGroup row spacing={4} name="maritalStatus" options={maritalStatus} />
                    </Stack>
                    <RHFTextField name="fatherName" label="Father Name" />
                    <RHFTextField name="personalEmail" label="Personal Email" />

                    <RHFTextField name="bloodGroup" label="Blood Group" />
                    <DatePicker
                      label="Date of Birth"
                      inputFormat="dd/MM/yyyy"
                      value={values.DOB}
                      onChange={getDob}
                      renderInput={(params) => (
                        <TextField
                          name="DOB"
                          size="small"
                          {...params}
                          error={Boolean(DOBError)}
                          helperText={DOBError}
                        />
                      )}
                      disableFuture // Disable future dates
                    />
                  </Box>
                  <Grid item xs={12} mt={2}>
                    {' '}
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
                        <RHFTextField name="address" label="Address" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <RHFTextField name="city" label="City" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <RHFTextField name="state" label="State/Region" />
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                        <RHFTextField name="bankName" label="Bank Name" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <RHFTextField name="IFSCCode" label="IFSC Code" />
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                        <RHFTextField size="small" name="education" label="Degree/Education" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <RHFTextField size="small" name="percentage" label="Mark(%)" />
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
                            />
                          )}
                          disableFuture // Disable future dates
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Paper>
          )}
        </Box>
        {/* ))} */}
        {/* {CurrentErrors.length > 0 && (
          <Box sx={{ pb: 3, px: 3 }}>
            <Card sx={{ p: 3, color: 'red' }}>
              <ul style={{ marginLeft: 10 }}>
                {CurrentErrors.map((errorItem, i) => (
                  <li key={i}>{errorItem}</li>
                ))}
              </ul>
            </Card>
          </Box>
        )} */}
        <Box sx={{ display: 'flex' }}>
          <Button
            color="error"
            // onClick={handleClickCancelOpen}
            onClick={() => navigate(PATH_DASHBOARD.employee.list)}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={(e) => handleBack(e)}
            sx={{ mr: 1, opacity: activeStep === 0 ? 0 : 1 }}
          >
            Back
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          {isStepOptional(activeStep) && (
            <Button color="inherit" onClick={(e) => handleSkip(e)} sx={{ mr: 1 }}>
              Skip
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              // disabled={CurrentErrors.length > 0}
              onClick={handleClickOpen}
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit(handleNext)}
              type="submit"
              // disabled={isNextButtonDisable}
            >
              Next
            </Button>
          )}
        </Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirmation to Add Employee</DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure want to Add Employee ?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="error">
              Disagree
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              // autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={cancelOpen} onClose={handleCancelClose}>
          <DialogTitle>Confirmation to Cancel and back to employee list page</DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure want to Cancel ?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="error">
              Disagree
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              // autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>

        {/* {JSON.stringify(values)} */}
      </>
    </FormProvider>
  );
}
