import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, DialogActions, Grid, Card, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { getDataFromApi, postDataToApi, putDataFromApi } from '../../../utils/apiCalls';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

LeaveTypeForm.propTypes = {
  view: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  row: PropTypes.object,
};

export default function LeaveTypeForm({ open, onClose, row, view }) {
  const { enqueueSnackbar } = useSnackbar();
  const LeaveTypeSchema = Yup.object().shape({
    name: Yup.string().required('Leave Type Name is Required'),
  });
  // eslint-disable-next-line no-unneeded-ternary
  const isEdit = typeof row === 'object' ? true : false;

  const [LeaveType, setLeaveType] = useState({});

  function getLeaveTypeById() {
    getDataFromApi(`leave/type/${row.id}`).then((res) => {
      setLeaveType(res.data);
    });
  }

  useEffect(() => {
    getLeaveTypeById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = useMemo(
    () => ({
      name: row?.name || '',
    }),
    [row]
  );

  const methods = useForm({
    resolver: yupResolver(LeaveTypeSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    if (LeaveType && LeaveType.id) {
      data.id = LeaveType.id;
      await putDataFromApi(`leave/type/update`, JSON.stringify(data));
    } else {
      await postDataToApi(`leave/type/create`, JSON.stringify(data));
    }
    onClose();
    enqueueSnackbar(LeaveType && LeaveType.id ? 'Update Success' : 'Add Success');
  };

  let DialogHeading = 'Add Leave Type';
  if (isEdit) DialogHeading = 'Update Leave Type';
  if (view) DialogHeading = 'View Leave Type';

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ pt: 4, pb: 5, px: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {DialogHeading}
            </Typography>
            {isEdit && <Typography>{`Leave Type ID: ${row.id}  `}</Typography>}
            &nbsp;
            <Stack spacing={3} sx={{ px: 0 }}>
              {view ? (
                <RHFTextField name="name" label="Leave Type Name" disabled />
              ) : (
                <RHFTextField name="name" label="Leave Type Name*" />
              )}
            </Stack>
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
