import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Button, TextField, DialogActions, Grid, Card, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
// components
import FormProvider, { RHFSelect, RHFTextField } from '../../../components/hook-form';
import { getDataFromApi, putDataFromApi } from '../../../utils/apiCalls';
import { useSnackbar } from '../../../components/snackbar';
import { convertDateTimeFormat } from '../../../utils/common';

UpdateViewLeaveRequestForm.propTypes = {
  view: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  row: PropTypes.object,
};

export default function UpdateViewLeaveRequestForm({ open, onClose, row, view }) {
  const { enqueueSnackbar } = useSnackbar();

  const [typeDetails, setTypeDetails] = useState([]);

  const [categoryDetails, setCategoryDetails] = useState([]);

  const [LeaveRequest, setLeaveRequest] = useState({});

  const [employee, setEmployee] = useState([]);

  const [formDisable, setFormDisable] = useState(false);

  const LeaveRequestSchema = Yup.object().shape({
    leaveType: Yup.string().required('Leave Type is Required'),
    leaveCategory: Yup.string().required('Leave Category is Required'),
    startDate: Yup.date()
      .required('Start date is required')
      .typeError('Start date should be a date'),
    endDate: Yup.date().required('End Date is required').typeError('End date should be a date'),
    reportingPerson: Yup.string().required('Reporting person is Required'),
    leaveCause: Yup.string().required(' Leave Cause is Required'),
    comment: Yup.string(),
    ApprovedBy: Yup.string(),
  });
  // eslint-disable-next-line no-unneeded-ternary
  const isEdit = typeof row === 'object' ? true : false;

  function getleaveRequestById() {
    getDataFromApi(`leave/request/${row.id}`).then((res) => {
      console.log(res.body, 'response');
      setLeaveRequest(res.data);
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
    getDataFromApi(`employee/listofreportingperson`).then((res) => {
      setEmployee(res.data);
    });
  };
  useEffect(() => {
    getleaveRequestById();
    getEmployeeDetails();
    getLeaveCategoryDetails();
    getLeaveTypeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = useMemo(
    () => ({
      empId: row?.empId || '',
      email: row?.email || '',
      reportingPersonEmail: row?.reportingPersonEmail || '',
      name: row?.name || '',
      leaveType: row?.leaveType || '',
      leaveCategory: row?.leaveCategory || '',
      startDate: row?.startDate || null,
      endDate: row?.endDate || null,
      leaveCause: row?.leaveCause || '',
      reportingPerson: row?.reportingPerson || '',
      comment: row?.comment || '',
      approvedBy: row?.approvedBy || 'Approval is Pending',
    }),
    [row]
  );

  const methods = useForm({
    resolver: yupResolver(LeaveRequestSchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit, reset } = methods;
  const values = watch();
  const handleApproved = async (data) => {
    if (LeaveRequest && LeaveRequest.id) {
      data.id = LeaveRequest.id;
      await putDataFromApi(`leave/request/update`, JSON.stringify({ ...data, status: 'approved' }));
      onClose();
      enqueueSnackbar('Update Success');
    }
  };

  const handleRejected = async (data) => {
    if (LeaveRequest && LeaveRequest.id) {
      data.id = LeaveRequest.id;
      await putDataFromApi(`leave/request/update`, JSON.stringify({ ...data, status: 'rejected' }));
      onClose();
      enqueueSnackbar('Update Success');
    }
  };

  let DialogHeading = 'Add Leave Request';
  if (isEdit) DialogHeading = 'Update Leave Request';
  if (view) DialogHeading = 'View Leave Request';

  useEffect(() => {
    if (isEdit) {
      getDataFromApi(`leave/request/${row.id}`).then((res) => {
        setFormDisable(true);
      });
    }
  }, [row.id, isEdit]);

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Card sx={{ pt: 4, pb: 5, px: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {DialogHeading}
            </Typography>
            {view ? '' : <Typography>{`Leave ID: ${row.id} `}</Typography>}
            &nbsp;
            <Grid container rowSpacing={2} columnSpacing={1}>
              {view ? (
                <Box sx={{ p: 2 }}>
                  <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
                    <Grid item xs={12} md={6}>
                      <Typography>Leave ID</Typography>
                      <Typography variant="subtitle1">{row.id}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>Leave Type</Typography>
                      <Typography variant="subtitle1">{row.leaveType}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>Leave Category</Typography>
                      <Typography variant="subtitle1">{row.leaveCategory}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>Start Date</Typography>
                      <Typography variant="subtitle1">
                        {convertDateTimeFormat(row.startDate)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>End Date</Typography>
                      <Typography variant="subtitle1">
                        {convertDateTimeFormat(row.endDate)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>Reporting Person</Typography>
                      <Typography variant="subtitle1">{row.reportingPerson}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>Leave Cause</Typography>
                      <Typography variant="subtitle1">{row.leaveCause}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>Comment</Typography>
                      <Typography variant="subtitle1">{row.comment}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>Aprroved By</Typography>
                      <Typography variant="subtitle1">{row.approvedBy}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <>
                  {' '}
                  <Grid item xs={12} md={6}>
                    <RHFSelect native name="leaveType" label=" Leave Type" disabled={formDisable}>
                      <option value="" />
                      {typeDetails.map((type, i) => (
                        <option key={i} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFSelect
                      native
                      name="leaveCategory"
                      label="Category Type"
                      disabled={formDisable}
                    >
                      <option value="" />
                      {categoryDetails.map((data, j) => (
                        <option key={j} value={data.name}>
                          {data.name}
                        </option>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {/* <RHFSelect
                      native
                      name="reportingPerson"
                      label="Reporting Person"
                      disabled={formDisable}
                    >
                      <option value="" />
                      {employee.map((data, k) => (
                        <option key={k} value={data.name}>
                          {data.name}
                        </option>
                      ))}
                    </RHFSelect> */}
                    <RHFTextField
                      fullWidth
                      name="reportingPerson"
                      label="Reporting Person"
                      disabled={formDisable}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {' '}
                    <DatePicker
                      label="Start Date"
                      inputFormat="dd/MM/yyyy"
                      value={values.startDate ? values.startDate : null}
                      onChange={(Sdate) => {
                        setValue('startDate', Sdate);
                      }}
                      renderInput={(params) => (
                        <TextField fullWidth size="small" {...params} disabled={formDisable} />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {' '}
                    <DatePicker
                      label="End Date"
                      inputFormat="dd/MM/yyyy"
                      value={values.endDate ? values.endDate : null}
                      onChange={(Edate) => {
                        setValue('endDate', Edate);
                      }}
                      renderInput={(params) => (
                        <TextField fullWidth size="small" {...params} disabled={formDisable} />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {' '}
                    <RHFTextField
                      name="leaveCause"
                      label="Leave Cause"
                      multiline
                      rows={3}
                      disabled={formDisable}
                    />
                  </Grid>{' '}
                  <Grid item xs={12}>
                    {' '}
                    <RHFTextField name="comment" label="Comment" multiline rows={3} />
                  </Grid>
                  <Grid item xs={12}>
                    {' '}
                    <RHFTextField
                      name="approvedBy"
                      label="Approved By"
                      multiline
                      rows={3}
                      disabled={formDisable}
                    />
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
                <>
                  <LoadingButton
                    color="success"
                    type="submit"
                    variant="contained"
                    onClick={handleSubmit(handleApproved)}
                  >
                    Approve
                  </LoadingButton>
                  <LoadingButton
                    color="error"
                    type="submit"
                    variant="contained"
                    onClick={handleSubmit(handleRejected)}
                  >
                    Reject
                  </LoadingButton>
                </>
              )}
            </DialogActions>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
