import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Stack, Button, Typography, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { DatePicker } from '@mui/x-date-pickers';
import FormProvider from '../../../components/hook-form/FormProvider';
import { RHFAutocomplete, RHFSelect, RHFSwitch, RHFTextField } from '../../../components/hook-form';
import { getDataFromApi, postDataToApi, putDataFromApi } from '../../../utils/apiCalls';
// ----------------------------------------------------------------------
const statusType = [
  { label: 'Not Started', value: 'not started' },
  { label: 'In Progress', value: 'in progress' },
  { label: 'On Hold', value: 'on hold' },
];
AddNewProjectForm.propTypes = {
  handleCloseModal: PropTypes.func,
  row: PropTypes.object,
};
// ----------------------------------------------------------------------
export default function AddNewProjectForm({ handleCloseModal, row }) {
  const { enqueueSnackbar } = useSnackbar();
  const [DOP, setDOP] = useState(row?.startDate || null);
  const [project, setProject] = useState({});
  const [employee, setEmployee] = useState([]);
  const [date, setDate] = useState('');
  // eslint-disable-next-line no-unneeded-ternary
  const [Switch, setSwitch] = useState(row?.visibility === 'active' ? true : false);

  // eslint-disable-next-line no-unneeded-ternary
  const isEdit = typeof row === 'object' ? true : false;

  const ProjectSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    status: Yup.string().required('Status is required'),
    projectHead: Yup.string().required('Project Head is required'),
    startDate: Yup.date()
      .required('Project Start Date is required')
      .typeError('Project Date should be a date'),
    visibility: Yup.string(),
  });
  const defaultValues = useMemo(
    () => ({
      name: row?.name || '',
      description: row?.description || '',
      visibility: Switch,
      projectHead: row?.projectHead,
      status: row?.status || '',
      startDate: row?.startDate || null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [row]
  );
  const methods = useForm({
    resolver: yupResolver(ProjectSchema),
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

  function getProjectById() {
    getDataFromApi(`project/${row.id}`).then((res) => {
      setProject(res.data);
    });
  }
  const onSubmit = async (data) => {
    try {
      if (data.visibility === true || Switch === true) {
        data.visibility = 'active';
      } else {
        data.visibility = 'inactive';
      }
      if (project && project.id) {
        data.id = project.id;
        await putDataFromApi(`project/update`, JSON.stringify(data));
      } else {
        await postDataToApi(`project/create`, JSON.stringify(data));
      }
      reset();
      handleCloseModal();
      enqueueSnackbar(project && project.id ? 'Update success!' : 'Create success!');
    } catch (error) {
      console.error(error);
    }
  };
  const getEmployeeDetails = () => {
    const employeeList = [];
    getDataFromApi(`employee/list`)
      .then((res) => {
        // eslint-disable-next-line array-callback-return
        res.data.map((emp) => {
          if (emp.empStatus === 'current employee') {
            employeeList.push(emp);
          }
        });
        setEmployee(employeeList);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setDate(formState.errors.startDate?.message ?? '');
  }, [formState.errors]);

  useEffect(() => {
    getEmployeeDetails();
    getProjectById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ pt: 4, pb: 5, px: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {isEdit ? 'Update Project' : ' Add Project'}
            </Typography>
            {isEdit && <Typography>{`Project ID:  ${row.id}`}</Typography>}
            &nbsp;
            <Stack spacing={3} sx={{ px: 0 }}>
              <RHFTextField name="name" label="Project Name" />
              <RHFTextField name="description" label="Description" multiline rows={3} />
                <DatePicker
                  label="Project Start Date"
                  inputFormat="dd/MM/yyyy"
                  value={DOP}
                  onChange={(date_startDate) => {
                    setValue('startDate', date_startDate);
                    setDOP(date_startDate);
                  }}
                  renderInput={(params) => (
                    <TextField size="small" {...params} error={Boolean(date)} helperText={date} />
                  )}
                  disableFuture
                />
              <RHFSelect native name="status" label="Status">
                <option value="" />
                {statusType.map((type, i) => (
                  <option key={i} value={type.label}>
                    {type.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect native name="projectHead" label="Project Head*">
                <option value="" />
                {employee.map((data, j) => (
                  <option key={j} value={data.empId}>
                    {data.name} ({data.empId})
                  </option>
                ))}
              </RHFSelect>
              <Stack sx={{ ml: 1, width: 1, justifyContent: 'flex-start' }}>
                <RHFSwitch
                  row
                  name="visibility"
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
            </Stack>
            <Stack direction="row" spacing={1.5} sx={{ mt: 3, justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save
              </LoadingButton>
              <Button color="inherit" variant="outlined" onClick={handleCloseModal}>
                Cancel
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
