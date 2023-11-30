import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { isBefore } from 'date-fns';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Button, TextField, DialogActions, Grid, Card, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
// components
import FormProvider, { RHFSelect, RHFTextField } from '../../../components/hook-form';
import { getDataFromApi, postDataToApi, putDataFromApi } from '../../../utils/apiCalls';
import { useSnackbar } from '../../../components/snackbar';
import { getLoggedInAdmin } from '../../../auth/utils';

LeaveRequestForm.propTypes = {
  view: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  row: PropTypes.object,
};

export default function LeaveRequestForm({ onClose, row, view }) {
  const { enqueueSnackbar } = useSnackbar();

  const [typeDetails, setTypeDetails] = useState([]);

  const [categoryDetails, setCategoryDetails] = useState([]);

  const [Leave, setLeave] = useState({});

  const [employee, setEmployee] = useState([]);

  const LeaveSchema = Yup.object().shape({
    leaveType: Yup.string().required('Leave Type is Required'),
    leaveCategory: Yup.string().required('Leave Category is Required'),
    startDate: Yup.date()
      .required('Start date is required')
      .typeError('Start date should be a date'),
    endDate: Yup.date().required('End Date is required').typeError('End date should be a date'),
    reportingPerson: Yup.string().required('Reporting person is Required'),
    reportingPersonId: Yup.string().required('Reporting person Id is Required'),
    leaveCause: Yup.string().required(' Leave Cause is Required'),
  });
  // eslint-disable-next-line no-unneeded-ternary
  const isEdit = typeof row === 'object' ? true : false;

  const [currentemployee, setcurrentemployee] = useState({});

  const user = getLoggedInAdmin();
  function getEmployeeById() {
    getDataFromApi(`employee/${user.empId}`).then((res) => {
      console.log('employeeeditpage employee details', res.data);
      setcurrentemployee(res.data);
      setValue('reportingPerson', res.data.reportingPerson);
      setValue('reportingPersonId', res.data.empId);
    });
  }
  useEffect(() => {
    getEmployeeById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getLeaveDetailsById() {
    getDataFromApi(`leave/leaverequest/${row.id}`).then((res) => {
      setLeave(res.data);
    });
  }

  const getLeaveTypeDetails = () => {
    getDataFromApi(`leave/type/list`).then((res) => {
      setTypeDetails(res.data);
    });
  };

  const getLeaveCategoryDetails = () => {
    getDataFromApi(`leave/category/list`).then((res) => {
      setCategoryDetails(res.data);
    });
  };

  const getEmployeeDetails = () => {
    getDataFromApi(`employee/list`).then((res) => {
      setEmployee(res.data);
    });
  };
  useEffect(() => {
    getLeaveDetailsById();
    getEmployeeDetails();
    getLeaveCategoryDetails();
    getLeaveTypeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = useMemo(
    () => ({
      leaveType: row?.leaveType || '',
      leaveCategory: row?.leaveCategory || '',
      startDate: row?.startDate || null,
      endDate: row?.endDate || null,
      leaveCause: row?.leaveCause || '',
      reportingPerson: row?.reportingPerson || '',
    }),
    [row]
  );

  const methods = useForm({
    resolver: yupResolver(LeaveSchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit } = methods;
  const values = watch();

  const onSubmit = async (data) => {
    console.log(data);
    if (Leave && Leave.id) {
      data.id = Leave.id;

      await putDataFromApi(
        `leave/leaverequest/update`,
        JSON.stringify({ ...data, status: 'pending' })
      );
    } else {
      await postDataToApi(`leave/leaverequest`, JSON.stringify(data));
    }
    onClose();
    enqueueSnackbar(Leave && Leave.id ? 'Update Success' : 'Add Success');
  };

  let DialogHeading = 'Add Leave Request';
  if (isEdit) DialogHeading = 'Update Leave Request';
  if (view) DialogHeading = 'View Leave Request';

  const isDateError =
    values.endDate && values.startDate
      ? isBefore(new Date(values.endDate), new Date(values.startDate))
      : false;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Card sx={{ pt: 4, pb: 5, px: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {DialogHeading}
            </Typography>
            {isEdit && <Typography>{`Leave ID: ${row.id} `}</Typography>}
            &nbsp;
            <Grid container rowSpacing={2} columnSpacing={1}>
              {view ? (
                <>
                  {' '}
                  <Grid item xs={12} md={6}>
                    <RHFSelect native name="leaveType" label=" Leave Type*" disabled>
                      <option value="" />
                      {typeDetails.map((type, i) => (
                        <option key={i} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFSelect native name="leaveCategory" label="Leave Category*" disabled>
                      <option value="" />
                      {categoryDetails.map((data, j) => (
                        <option key={j} value={data.name}>
                          {data.name}
                        </option>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {' '}
                    <DatePicker
                      disabled
                      label="Start Date*"
                      inputFormat="dd/MM/yyyy"
                      value={values.startDate ? values.startDate : null}
                      onChange={(Sdate) => {
                        setValue('startDate', Sdate);
                      }}
                      renderInput={(params) => (
                        <TextField disabled fullWidth size="small" {...params} />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {' '}
                    <DatePicker
                      disabled
                      label="End Date*"
                      inputFormat="dd/MM/yyyy"
                      value={values.endDate ? values.endDate : null}
                      onChange={(Edate) => {
                        setValue('endDate', Edate);
                      }}
                      renderInput={(params) => (
                        <TextField
                          disabled
                          fullWidth
                          size="small"
                          {...params}
                          error={!!isDateError}
                          helperText={isDateError && 'end date must be later than start date'}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {' '}
                    <RHFTextField
                      name="leaveCause"
                      label="Leave Cause*"
                      multiline
                      rows={3}
                      disabled
                    />
                  </Grid>{' '}
                  <Grid item xs={12}>
                    <RHFTextField fullWidth name="reportingPerson" label="Reporting Person" />
                  </Grid>
                </>
              ) : (
                <>
                  {' '}
                  <Grid item xs={12} md={6}>
                    <RHFSelect native name="leaveType" label=" Leave Type*">
                      <option value="" />
                      {typeDetails.map((type, i) => (
                        <option key={i} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFSelect native name="leaveCategory" label="Leave Category*">
                      <option value="" />
                      {categoryDetails.map((data, j) => (
                        <option key={j} value={data.name}>
                          {data.name}
                        </option>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {' '}
                    <DatePicker
                      label="Start Date*"
                      inputFormat="dd/MM/yyyy"
                      value={values.startDate ? values.startDate : null}
                      onChange={(Sdate) => {
                        setValue('startDate', Sdate);
                      }}
                      renderInput={(params) => <TextField fullWidth size="small" {...params} />}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {' '}
                    <DatePicker
                      label="End Date*"
                      inputFormat="dd/MM/yyyy"
                      value={values.endDate ? values.endDate : null}
                      onChange={(Edate) => {
                        setValue('endDate', Edate);
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          size="small"
                          {...params}
                          error={!!isDateError}
                          helperText={isDateError && 'end date must be later than start date'}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {' '}
                    <RHFTextField name="leaveCause" label="Leave Cause*" multiline rows={3} />
                  </Grid>{' '}
                  <Grid item xs={12}>
                    <RHFTextField fullWidth name="reportingPerson" label="Reporting Person" />
                  </Grid>
                </>
              )}
            </Grid>
            <DialogActions>
              <Box sx={{ flexGrow: 1 }} />
              <Button variant="outlined" color="inherit" onClick={onClose}>
                Cancel
              </Button>
              {view ? (
                ''
              ) : (
                <LoadingButton
                  type="submit"
                  variant="contained"
                  onClick={(e) => {
                    handleSubmit();
                  }}
                >
                  {isEdit ? 'Submit' : 'Submit'}
                </LoadingButton>
              )}
            </DialogActions>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
