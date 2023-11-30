/* eslint-disable no-unneeded-ternary */
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
// @mui
import {
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  Grid,
  Card,
  Box,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { deleteDataFromApi } from '../../utils/apiCalls';
import FormProvider from '../hook-form/FormProvider';
import { RHFTextField } from '../hook-form';
import { useSnackbar } from '../snackbar';
// ----------------------------------------------------------------------

TodoConfirmDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.node,
  action: PropTypes.node,
  content: PropTypes.node,
  onClose: PropTypes.func,
  row: PropTypes.object,
};

export default function TodoConfirmDialog({
  row,
  title,
  content,
  action,
  open,
  onClose,
  ...other
}) {
  const methods = useForm({
    defaultValues: {
      comment: '',
      id: row?.id,
    },
  });

  console.log(row, 'row');
  const { handleSubmit } = methods;
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (data) => {
    console.log(data);
    data.id = row?.id;
    deleteDataFromApi(`todo/delete`, JSON.stringify(data));
    onClose(row);
    enqueueSnackbar('Delete Successfully');
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ pt: 2, pb: 2, px: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Are you sure want to delete Todo?
              </Typography>
              <Grid container rowSpacing={2} columnSpacing={1}>
                <Grid item xs={12}>
                  <RHFTextField name="comment" label="Comment" multiline rows={3} />
                </Grid>
              </Grid>
              <DialogActions>
                <Box sx={{ flexGrow: 1 }} />
                <Button variant="outlined" color="inherit" onClick={onClose}>
                  Cancel
                </Button>
                <LoadingButton type="submit" variant="contained">
                  Submit
                </LoadingButton>
              </DialogActions>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Dialog>
  );
}
