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
import FormProvider, { RHFAutocomplete, RHFTextField } from '../../../components/hook-form';
import { getDataFromApi, postDataToApi, putDataFromApi } from '../../../utils/apiCalls';
import { useSnackbar } from '../../../components/snackbar';
//-------------------------------------------------------
EmployeeAppraisalForm.propTypes = {
  view: PropTypes.bool,
  onClose: PropTypes.func,
  row: PropTypes.object,
  rowValidation: PropTypes.bool
};
export default function EmployeeAppraisalForm({ onClose, row, rowValidation, view }) {
  const { enqueueSnackbar } = useSnackbar();
  const [EmployeeAppraisal, setEmployeeAppraisal] = useState({});
  const [DOP, setDOP] = useState(row?.appraisalDate || null);
  const [employee, setEmployee] = useState([]);
  const EmployeeAppraisalSchema = Yup.object().shape({
    employeeId: Yup.string().required('Appraisee Employee is Required'),
    hrName: Yup.string().required('Hr Name is Required'),
    appraisalDate: Yup.date().required('Appraisal Date is required').typeError('End date should be a date'),
    reviewingAppraiser: Yup.string().required('Reviewing Appraiser is Required'),
  });
  // eslint-disable-next-line no-unneeded-ternary
  const isEdit = rowValidation === true ? true : false;
  const [isEditCheck, setIsEditCheck] = useState(rowValidation);
  const [isViewCheck, setIsViewCheck] = useState(view);
  function getAppraisalDetailsById() {
    getDataFromApi(`appraisal/${row.aprId}`).then((res) => {
      setEmployeeAppraisal(res.data);
    });
  }
  const getEmployeeDetails = () => {
    getDataFromApi(`employee/list`).then((res) => {
      setEmployee(res.data);
    });
  };
  useEffect(() => {
    getAppraisalDetailsById();
    getEmployeeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const defaultValues = useMemo(
    () => ({
      employeeId: row?.employeeId || '',
      hrName: row?.hrName || '',
      reviewingAppraiser: row?.reviewingAppraiser || '',
      appraisalDate: row?.appraisalDate || null,
      employeeName: row?.employeeName,
      emailId: row?.emailId,
      designation: row?.designation,
      totalExperience: row?.totalExperience,
      inevitableExperience: row?.inevitableExperience,
      reportingperson: row?.reportingPerson,
      dateOfJoining: row?.dateOfJoining,
      lastUpdate: row?.lastUpdate,
      status: row?.status,
      submission_date: row?.submission_date,
    }),
    [row]
  );
  const methods = useForm({
    resolver: yupResolver(EmployeeAppraisalSchema),
    defaultValues,
  });
  const { watch, setValue, handleSubmit } = methods;
  const values = watch();
  const onSubmit = async (data) => {
    if (EmployeeAppraisal && EmployeeAppraisal.aprId) {
      await putDataFromApi(`appraisal/updateEmployeeAppraisal/${row.aprId}`, JSON.stringify(data));
      enqueueSnackbar('Update Success');
      setIsEditCheck(false)
      setIsViewCheck(false)
      onClose();
    } else {
      await postDataToApi(`appraisal/create`, JSON.stringify(data))
        .then((datae) => {

          if (datae.result === false) {
            window.Toast(datae.message, { variant: "error" });
          }
          else {
            enqueueSnackbar('Add Success');
          }
        });
      setIsEditCheck(false)
      setIsViewCheck(false)
      onClose();
    }
  };
  let DialogHeading = (!isEdit && !view) ? 'New Appraisal' : '';
  if (isEditCheck) DialogHeading = 'Update Appraisal';
  if (isViewCheck) DialogHeading = 'View Appraisal';
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Card sx={{ pt: 4, pb: 5, px: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {DialogHeading}
            </Typography>
            <Grid container rowSpacing={2} columnSpacing={1}>
              {(!view && !isEdit) ? (
                <>
                  <Grid item xs={12} md={6}>
                    <RHFAutocomplete
                      fullWidth
                      required
                      size="small"
                      name='employeeId'
                      label="Appraisee Employee*"
                      ChipProps={{ size: "small" }}
                      options={employee}
                      getOptionLabel={(option) =>
                        typeof option === "object" ? `${option?.empId}(${option.name})` : option
                      }
                      isOptionEqualToValue={(option, value) =>
                        option?.empId === value
                      }
                      onChange={(e, value) => {
                        setValue('employeeId', value.empId);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFAutocomplete
                      fullWidth
                      required
                      size="small"
                      name='hrName'
                      label="Hr Name*"
                      ChipProps={{ size: "small" }}
                      options={employee}
                      getOptionLabel={(option) =>
                        typeof option === "object" ? `${option?.empId}(${option.name})` : option
                      }
                      isOptionEqualToValue={(option, value) =>
                        option?.empId === value
                      }
                      onChange={(e, value) => {
                        setValue('hrName', value.empId);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFAutocomplete
                      fullWidth
                      required
                      size="small"
                      name='reviewingAppraiser'
                      label="Reviewing Appraiser*"
                      ChipProps={{ size: "small" }}
                      options={employee}
                      getOptionLabel={(option) =>
                        typeof option === "object" ? `${option?.empId}(${option.name})` : option
                      }
                      isOptionEqualToValue={(option, value) =>
                        option?.empId === value
                      }
                      onChange={(e, value) => {
                        setValue('reviewingAppraiser', value.empId);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Appraisal Date"
                      inputFormat="dd/MM/yyyy"
                      value={DOP}
                      onChange={(appraisalDate) => {
                        setValue('appraisalDate', appraisalDate);
                        setDOP(appraisalDate);
                      }}
                      renderInput={(params) => <TextField fullWidth required {...params} size="small" />}
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} md={4}>
                    <RHFTextField name="employeeId" label="Employee ID" disabled />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <RHFTextField name="employeeName" label="Employee Name" disabled />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <RHFTextField name="emailId" label="Email Id" disabled />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <RHFTextField name="designation" label="Designation" disabled />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <RHFTextField name="totalExperience" label="Total Experience" disabled />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <RHFTextField name="inevitableExperience" label="Inevitable Experience" disabled />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <RHFAutocomplete
                      fullWidth
                      required
                      disabled
                      size="small"
                      name='employeeId'
                      label="Appraisee Employee*"
                      ChipProps={{ size: "small" }}
                      options={employee}
                      getOptionLabel={(option) =>
                        typeof option === "object" ? `${option?.empId}(${option.name})` : option
                      }
                      isOptionEqualToValue={(option, value) =>
                        option?.empId === value
                      }
                      onChange={(e, value) => {
                        setValue('employeeId', value.empId);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <RHFAutocomplete
                      fullWidth
                      required
                      disabled={view}
                      size="small"
                      name='reviewingAppraiser'
                      label="Reviewing Appraiser*"
                      ChipProps={{ size: "small" }}
                      options={employee}
                      getOptionLabel={(option) =>
                        typeof option === "object" ? `${option?.empId}(${option.name})` : option
                      }
                      isOptionEqualToValue={(option, value) =>
                        option?.empId === value
                      }
                      onChange={(e, value) => {
                        setValue('reviewingAppraiser', value.empId);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <RHFAutocomplete
                      fullWidth
                      required
                      disabled
                      size="small"
                      name='hrName'
                      label="Hr Name*"
                      ChipProps={{ size: "small" }}
                      options={employee}
                      getOptionLabel={(option) =>
                        typeof option === "object" ? `${option?.empId}(${option.name})` : option
                      }
                      isOptionEqualToValue={(option, value) =>
                        option?.empId === value
                      }
                      onChange={(e, value) => {
                        setValue('hrName', value.empId);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      disabled
                      label="Date Of Joining"
                      inputFormat="dd/MM/yyyy"
                      value={values.appraisalDate ? values.appraisalDate : null}
                      onChange={(Sdate) => {
                        setValue('DateOfJoining', Sdate);
                      }}
                      renderInput={(params) => (
                        <TextField disabled={view} fullWidth size="small" {...params} />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      disabled={view}
                      label="Appraisal Date"
                      inputFormat="dd/MM/yyyy"
                      value={values.appraisalDate ? values.appraisalDate : null}
                      onChange={(Sdate) => {
                        setValue('appraisalDate', Sdate);
                      }}
                      renderInput={(params) => (
                        <TextField disabled={view} fullWidth size="small" {...params} />
                      )}
                    />
                  </Grid>
                  {
                    (view) ?
                      <Grid item xs={12} md={4}>
                        <DatePicker
                          disabled
                          label="Last Update"
                          inputFormat="dd/MM/yyyy"
                          value={values.appraisalDate ? values.appraisalDate : null}
                          onChange={(Sdate) => {
                            setValue('lastUpdate', Sdate);
                          }}
                          renderInput={(params) => (
                            <TextField disabled fullWidth size="small" {...params} />
                          )}
                        />
                      </Grid> : ''
                  }
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
                >
                  {isEdit ? 'Save' : 'Save'}
                </LoadingButton>
              )}
            </DialogActions>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
