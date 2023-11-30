import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState, useCallback, useMemo, useEffect } from 'react';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Stack, Button, Typography, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { DatePicker } from '@mui/x-date-pickers';
import { Upload } from '../../../components/upload';
import { capitalize, convertBase64 } from '../../../utils/common';
import FormProvider from '../../../components/hook-form/FormProvider';
import { RHFSwitch, RHFTextField } from '../../../components/hook-form';
import { getDataFromApi, postDataToApi, putDataFromApi } from '../../../utils/apiCalls';
// ----------------------------------------------------------------------
AddNewPolicyForm.propTypes = {
  handleCloseModal: PropTypes.func,
  row: PropTypes.object,
};
// ----------------------------------------------------------------------
let POLICY_SELECTED_FILE = null;
export default function AddNewPolicyForm({ row, handleCloseModal }) {
  const { enqueueSnackbar } = useSnackbar();
  const [DOP, setDOP] = useState(row?.date || null);
  const [Switch, setSwitch] = useState(row?.status === 'active');
  const [PolicyFile, setPolicyFile] = useState(row?.document || null);
  const [preview, setPreview] = useState(row?.document || null);
  const [policy, setPolicy] = useState({});
  const [effectiveDate, setEffectiveDate] = useState('');
  const [doc, setDoc] = useState('');
  const PolicySchema = Yup.object().shape({
    name: Yup.string().required('Policy Name is required'),
    description: Yup.string().required('Description is required'),
    document: Yup.string().required('Document is required'),
    date: Yup.date()
      .required('Effective Date is required')
      .typeError('Effective Date should be a date'),
  });
  // eslint-disable-next-line no-unneeded-ternary
  const isEdit = typeof row === 'object' ? true : false;
  console.log(row);
  function getPolicyById() {
    getDataFromApi(`policy/${row.id}`).then((res) => {
      setPolicy(res.data);
    });
  }
  const defaultValues = useMemo(
    () => ({
      name: row?.name || '',
      description: row?.description || '',
      status: Switch,
      document: row?.document || '',
      date: row?.date || null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [row]
  );
  const methods = useForm({
    resolver: yupResolver(PolicySchema),
    defaultValues,
  });
  const {
    reset,
    setValue,
    handleSubmit,
    formState,
    formState: { isSubmitting },
  } = methods;
  function switchData(data) {
    setSwitch(data);
  }
  const onSubmit = async (data) => {
    try {
      if (data.status === true || Switch === true) {
        data.status = 'active';
      } else {
        data.status = 'inactive';
      }
      if (policy && policy.id) {
        data.id = policy.id;
        await putDataFromApi(`policy/update`, JSON.stringify(data));
      } else {
        await postDataToApi(`policy/create`, JSON.stringify(data));
      }
      reset();
      handleCloseModal();
      enqueueSnackbar(policy && policy.id ? 'Update success!' : 'Create success!');
    } catch (error) {
      console.error(error);
    }
  };
  const handleDrop = useCallback(
    async (acceptedFiles) => {
      POLICY_SELECTED_FILE = acceptedFiles[0];
      const base64 = await convertBase64(POLICY_SELECTED_FILE);
      if (POLICY_SELECTED_FILE) {
        setPolicyFile(base64);
        setPreview(base64);
        setValue('document', base64, { shouldValidate: true });
      }
    },
    [setValue]
  );
  useEffect(() => {
    getPolicyById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setEffectiveDate(formState.errors.date?.message ?? '');
    setDoc(formState.errors.document?.message ?? '');
  }, [formState.errors]);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {isEdit ? 'Update Policy' : ' Add Policy'}
            </Typography>
            {isEdit && <Typography>{`Policy ID:  ${row.id}`}</Typography>}
            &nbsp;
            <Stack spacing={3}>
              <RHFTextField name="name" label="Policy Name*" />
              <RHFTextField name="description" label="Description*" multiline rows={3} />
              <DatePicker
                label="Effective From*"
                inputFormat="dd/MM/yyyy"
                value={DOP}
                onChange={(date_Effectivefrom) => {
                  setValue('date', date_Effectivefrom);
                  setDOP(date_Effectivefrom);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    error={Boolean(effectiveDate)}
                    helperText={effectiveDate}
                  />
                )}
              />
              <Stack sx={{ ml: 1, width: 1, justifyContent: 'flex-start' }}>
                <RHFSwitch
                  name="status"
                  labelPlacement="start"
                  onClick={(e) => {
                    switchData(!Switch);
                  }}
                  label={
                    <Typography variant="subtitle" sx={{ color: 'text.secondary' }}>
                      {Switch === true || Switch === 'active' ? 'Active' : 'Inactive'}
                    </Typography>
                  }
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  File Upload*
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    mx: 'auto',
                    display: 'block',
                    color: 'text.secondary',
                  }}
                >
                  Allowed *.pdf max size of 4MB
                </Typography>
                <Upload
                  thumbnail={preview || null}
                  name="document"
                  acceptedFiles={{ accept: '.pdf' }}
                  file={PolicyFile}
                  onDrop={handleDrop}
                  error={Boolean(doc)}
                  helperText={doc}
                />
              </Stack>
            </Stack>
            <Stack direction="row" spacing={1.5} sx={{ mt: 3, justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                SAVE
              </LoadingButton>
              <Button color="inherit" variant="outlined" onClick={handleCloseModal}>
                CANCEL
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
