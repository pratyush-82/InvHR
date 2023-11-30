import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, DialogActions, Grid, Card, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { useSnackbar } from '../../../components/snackbar';
import { getDataFromApi, postDataToApi, putDataFromApi } from '../../../utils/apiCalls';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export const Branch = ['lucknow', 'bangalore', 'delhi'];

AddTODOForm.propTypes = {
  //   holiday: PropTypes.object,
  //   open: PropTypes.bool,
  onClose: PropTypes.func,
  row: PropTypes.object,
};

export default function AddTODOForm({ onClose, row }) {
  const [checked, setChecked] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  const TODOSchema = Yup.object().shape({
    details: Yup.string().required('Holiday Details is required'),
  });
  // eslint-disable-next-line no-unneeded-ternary
  const isEdit = typeof row === 'object' ? true : false;
  const { id } = useParams();
  const [todo, setTodo] = useState({});
  function getTodoListByID() {
    getDataFromApi(`todo/${row.id}`).then((res) => {
      setTodo(res.data);
    });
  }
  useEffect(() => {
    getTodoListByID();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = useMemo(
    () => ({
      details: row?.details || '',
    }),
    [row]
  );

  const methods = useForm({
    resolver: yupResolver(TODOSchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit, reset } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    if (todo && todo.id) {
      data.id = todo.id;
      await putDataFromApi(`todo/update`, JSON.stringify(data));
    } else {
      await postDataToApi(`todo/create`, JSON.stringify(data));
    }
    enqueueSnackbar(todo && todo.id ? 'Update Success' : 'Add Success');
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ pt: 4, pb: 5, px: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {isEdit ? 'Update TODO' : ' Add TODO'}
            </Typography>
            {isEdit && <Typography>{`TODO ID: ${row.id}`}</Typography>}
            &nbsp;
            <Stack spacing={3} sx={{ px: 0 }}>
              <RHFTextField name="details" label="Details*" multiline rows={3} />
            </Stack>
            <DialogActions>
              <Box sx={{ flexGrow: 1 }} />

              <LoadingButton
                type="submit"
                variant="contained"
                onClick={() => {
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
