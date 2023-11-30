import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Stack,
  Button,
  TextField,
  DialogActions,
  Grid,
  Card,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
// components

import { isBefore } from 'date-fns';
import FormProvider, { RHFSelect, RHFTextField } from '../../../components/hook-form';
import { getDataFromApi, postDataToApi, putDataFromApi } from '../../../utils/apiCalls';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

WorklogForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  row: PropTypes.object,
};

export default function WorklogForm({ onClose, row }) {
  const { enqueueSnackbar } = useSnackbar();
  const [worklog, setWorklog] = useState(null);
  const WorklogSchema = Yup.object().shape({
    projectName: Yup.string().required('Project name is Required'),
    start: Yup.date().required('Start time is required'),
    end: Yup.date().required('End time is required'),
    comment: Yup.string().required('comment is required'),
  });
  // eslint-disable-next-line no-unneeded-ternary
  const isEdit = worklog && worklog.id;

  const [list, setList] = useState([]);

  const getProjectDetails = () => {
    getDataFromApi(`project/list`).then((res) => {
      setList(res.data);
      console.log('list', res.data);
    });
  };

  const defaultValues = useMemo(
    () => ({
      projectName: row?.projectName || '',
      start: row?.start || null,
      end: row?.end || null,
      comment: row?.comment || '',
    }),
    [row]
  );

  const methods = useForm({
    resolver: yupResolver(WorklogSchema),
    defaultValues,
  });

  const { reset, watch, setValue, control, handleSubmit } = methods;

  const values = watch();
  function getWorklogById() {
    getDataFromApi(`timesheet/worklog/${row.id}`).then((res) => {
      setWorklog(res.data);
    });
  }

  useEffect(() => {
    getWorklogById();
    getProjectDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(data) {
    if (worklog && worklog.id) {
      data.id = worklog.id;
      await putDataFromApi(`timesheet/worklog/update`, JSON.stringify(data));
    } else {
      await postDataToApi(`timesheet/worklog/create`, JSON.stringify(data));
    }
    enqueueSnackbar(!isEdit ? 'Add Success' : 'Update Success');
  }

  const isDateError =
    values.start && values.end ? isBefore(new Date(values.end), new Date(values.start)) : false;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ pt: 4, pb: 5, px: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {isEdit ? 'Update Worklog' : 'Add Working'}
            </Typography>
            <Stack spacing={3}>
              <RHFSelect name="projectName" label="Project Name*" placeholder="Project Name" native>
                <option value="" />
                {list.map((data, m) => (
                  <option key={m} value={data.name}>
                    {data.name}
                  </option>
                ))}
              </RHFSelect>
              <Controller
                name="start"
                control={control}
                render={({ field }) => (
                  <MobileDateTimePicker
                    {...field}
                    onChange={(Stime) => {
                      setValue('start', Stime);
                    }}
                    label="Start Time*"
                    inputFormat="dd/MM/yyyy hh:mm a"
                    renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                    disableFuture // Disable future dates
                  />
                )}
              />

              <Controller
                name="end"
                control={control}
                render={({ field }) => (
                  <MobileDateTimePicker
                    {...field}
                    onChange={(Etime) => {
                      setValue('end', Etime);
                    }}
                    label="End Time*"
                    inputFormat="dd/MM/yyyy hh:mm a"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        error={!!isDateError}
                        helperText={isDateError && 'End date must be later than start date'}
                      />
                    )}
                    disableFuture // Disable future dates
                  />
                )}
              />
              <RHFTextField name="comment" multiline rows={4} label="Comment*" />
            </Stack>
            <DialogActions>
              <Box sx={{ flexGrow: 1 }} />

              <LoadingButton
                type="submit"
                variant="contained"
                onClick={(e) => {
                  handleSubmit();
                  onClose();
                }}
              >
                {isEdit ? 'Save' : 'Save'}
              </LoadingButton>
              <Button variant="outlined" color="inherit" onClick={onClose}>
                Cancel
              </Button>
            </DialogActions>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
