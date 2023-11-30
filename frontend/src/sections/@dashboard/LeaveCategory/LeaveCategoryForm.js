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

LeaveCategoryForm.propTypes = {
  view: PropTypes.bool,
  onClose: PropTypes.func,
  row: PropTypes.object,
};

export default function LeaveCategoryForm({ onClose, row, view }) {
  const { enqueueSnackbar } = useSnackbar();

  const LeaveCategorySchema = Yup.object().shape({
    name: Yup.string().required('Leave Category Name is Required'),
  });
  // eslint-disable-next-line no-unneeded-ternary
  const isEdit = typeof row === 'object' ? true : false;

  const [LeaveCategory, setLeaveCategory] = useState({});
  function getLeaveCategoryById() {
    getDataFromApi(`leave/category/${row.id}`).then((res) => {
      setLeaveCategory(res.data);
    });
  }
  useEffect(() => {
    getLeaveCategoryById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = useMemo(
    () => ({
      name: row?.name || '',
    }),
    [row]
  );

  const methods = useForm({
    resolver: yupResolver(LeaveCategorySchema),
    defaultValues,
  });

  const {
    handleSubmit,
  } = methods;

  const onSubmit = async (data) => {
    if (LeaveCategory && LeaveCategory.id) {
      data.id = LeaveCategory.id;
      await putDataFromApi(`leave/category/update`, JSON.stringify(data));
    } else {
      await postDataToApi(`leave/category/create`, JSON.stringify(data));
    }
    onClose();
    enqueueSnackbar(
      LeaveCategory && LeaveCategory.id ? 'Update Success' : 'Add Success'
    );
  };

  let DialogHeading = 'Add Leave Category';
  if (isEdit) DialogHeading = 'Update Leave Category';
  if (view) DialogHeading = 'View Leave Category';

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ pt: 4, pb: 5, px: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {DialogHeading}
            </Typography>
            {isEdit && <Typography>{`Leave Category ID: ${row.id} `}</Typography>}
            &nbsp;
            <Stack spacing={3} sx={{ px: 0 }}>
              {view ? (
                <RHFTextField name="name" label="Leave Category Name" disabled />
              ) : (
                <RHFTextField name="name" label="Leave Category Name" />
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
