import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
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
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
// components
import FormProvider, { RHFRadioGroup, RHFTextField } from '../../../components/hook-form';
import { getDataFromApi, postDataToApi, putDataFromApi } from '../../../utils/apiCalls';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export const Branch = ['lucknow', 'bangalore', 'delhi'];

HolidayForm.propTypes = {
  holiday: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  row: PropTypes.object,
};

export default function HolidayForm({ onClose, row }) {
  const [checked, setChecked] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  const [branchObj, setBranchObj] = useState(Branch);
  const HolidaySchema = Yup.object().shape({
    name: Yup.string().required('Holiday name is Required'),
    details: Yup.string().required('Holiday Details is required'),
    date: Yup.date().required('date must be choose'),
    branch: Yup.object().required('Branch is required'),
  });
  // eslint-disable-next-line no-unneeded-ternary
  const isEdit = typeof row === 'object' ? true : false;

  const [Holiday, setHoliday] = useState({});
  function getHolidayByID() {
    getDataFromApi(`holiday/${row.id}`).then((res) => {
      setHoliday(res.data);
    });
  }
  useEffect(() => {
    getHolidayByID();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = useMemo(
    () => ({
      name: row?.name || '',
      details: row?.details || '',
      date: row?.date || null,
      branch: row?.branch || {},
    }),
    [row]
  );

  const methods = useForm({
    resolver: yupResolver(HolidaySchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit, reset } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    console.log('data', data);
    if (Holiday && Holiday.id) {
      data.id = Holiday.id;
      await putDataFromApi(`holiday/update`, JSON.stringify(data)).then((res) => {
        if (res.result) {
          enqueueSnackbar('Update Success');
        } else {
          enqueueSnackbar('Holiday is Already Present On That Date', {
            variant: 'error',
          });
        }
      });
    } else {
      await postDataToApi(`holiday/create`, JSON.stringify(data)).then((res) => {
        if (res.result) {
          enqueueSnackbar('Holiday Success');
        } else {
          enqueueSnackbar('Holiday is Already Present On That Date', {
            variant: 'error',
          });
        }
      });
    }
    onClose();
  };

  //  useEffect(() => {
  //     if (isEdit) {
  //       getDataFromApi(`holiday/${row.id}`)
  //         .then((res) => {
  //           console.log(res.data);
  //           const  value = {
  //             branch:res?.data?.branch??'',
  //           };

  //           // Reset form values with the received data
  //           reset({ ...res.data.branch });

  //           // Set the branch value using setValue for checkboxes
  //           Object.keys(branch).forEach((item) => {
  //             setValue("branch",item, true);
  //           });
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }
  //   }, [isEdit, reset, row.id, setValue]);

  const handleChange = (event) => {
    const tempBranch = values.branch;
    tempBranch[event.target.value] = event.target.checked;
    setValue('branch', tempBranch);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ pt: 4, pb: 5, px: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {isEdit ? 'Update Holiday' : ' Add Holiday'}
            </Typography>
            {isEdit && <Typography>{`Holiday ID:  ${row.id}`}</Typography>}
            &nbsp;
            <Stack spacing={3} sx={{ px: 0 }}>
              <RHFTextField name="name" label="Holiday Name*" />

              <RHFTextField name="details" label="Holiday Details*" multiline rows={3} />

              <DatePicker
                label="Holiday Date*"
                inputFormat="dd/MM/yyyy"
                value={values.date}
                onChange={(dateHoliday) => {
                  setValue('date', dateHoliday);
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
                disablePast // Disable past dates
              />
            </Stack>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2.2}
              mt={2}
            >
              <Typography variant="subtitle1">Branch *</Typography>

              {/* <RHFRadioGroup row spacing={2} name="branch" options={branch} /> */}
              <FormGroup row>
                {Branch.map((item) => (
                  <FormControlLabel
                    key={item}
                    control={
                      <Checkbox
                        onChange={handleChange}
                        value={item}
                        checked={
                          values.branch && item in values.branch ? values?.branch[item] : false
                        }
                      />
                    }
                    label={item}
                  />
                ))}
              </FormGroup>
            </Stack>
            <DialogActions>
              <Box sx={{ flexGrow: 1 }} />

              <LoadingButton
                type="submit"
                variant="contained"
                onClick={() => {
                  handleSubmit();
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
