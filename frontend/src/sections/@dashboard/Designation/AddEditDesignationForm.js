/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Grid,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  Typography,
  Box,
} from '@mui/material';
import Scrollbar from '../../../components/scrollbar';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSelect, RHFSwitch, RHFTextField } from '../../../components/hook-form';
import { MODULE_PERMISSIONS } from '../../../config-global';
import { getDataFromApi, postDataToApi, putDataFromApi } from '../../../utils/apiCalls';

// ----------------------------------------------------------------------

AddEditDesignationForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  row: PropTypes.object,
};

export default function AddEditDesignationForm({ isEdit = false, isView = false, row }) {
  console.log('isEdit', isEdit, row);
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [formDisable, setFormDisable] = useState(false);

  const [list, setList] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const DesignationSchema = Yup.object().shape({
    name: Yup.string().required('Designation is required'),
    description: Yup.string().required('Description is required'),
    status: Yup.string().required('status should be chosen'),
  });

  const getDesignationDetails = () => {
    const designationList = [];
    getDataFromApi(`designation/list`)
      .then((res) => {
        // eslint-disable-next-line array-callback-return
        res.data.map((desg) => {
          if (desg.status === 'active') {
            designationList.push(desg);
          }
        });
        setList(designationList);
        console.log('designation details', designationList);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDesignationDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = {
    name: '',
    description: '',
    permission: {},
    status: false,
  };

  const methods = useForm({
    resolver: yupResolver(DesignationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit) {
      getDataFromApi(`designation/${row.id}`)
        .then((res) => {
          console.log('78', res.data.status);
          reset({
            ...defaultValues,
            ...res.data,
          });
          setPrivilegeObj({
            ...MODULE_PERMISSIONS,
            ...res.data.permission,
          });
          // eslint-disable-next-line no-unneeded-ternary
          setValue('status', res.data.status === 'active' ? true : false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isEdit, row?.id, reset]);

  useEffect(() => {
    if (isView) {
      getDataFromApi(`designation/${row.id}`)
        .then((res) => {
          console.log('78', res.data.description);
          setFormDisable(true);
          reset({
            ...defaultValues,
            ...res.data,
          });
          setPrivilegeObj({
            ...MODULE_PERMISSIONS,
            ...res.data.permission,
          });
          // eslint-disable-next-line no-unneeded-ternary
          setValue('status', res.data.status === 'active' ? true : false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isEdit, row?.id, reset]);

  const onSubmit = async (data) => {
    if (data.status === 'true') {
      data.status = 'active';
    } else {
      data.status = 'inactive';
    }
    console.log(' data.status', data.status);
    data.permission = privilegeObj;
    if (isEdit && data.id) {
      await putDataFromApi(`designation/update`, JSON.stringify(data));
      navigate(PATH_DASHBOARD.designation.list);
    } else {
      await postDataToApi(`designation/create`, JSON.stringify(data));
      navigate(PATH_DASHBOARD.designation.list);
    }
    enqueueSnackbar(
      isEdit && data.id ? 'Designation update successfully' : 'Designation created successfully'
    );
  };

  const handleSaveAsDraft = async (data) => {
    reset();
    setLoadingSave(false);
    navigate(PATH_DASHBOARD.designation.list);
  };

  const [privilegeObj, setPrivilegeObj] = useState(MODULE_PERMISSIONS);

  const [privilege, setPrivilege] = useState([]);

  useEffect(() => {
    setPrivilege(Object.keys(privilegeObj));
  }, [privilegeObj]);

  const handlePermissionCheckboxClick = (group, module, permission, value) => {
    const privilegeObjCopy = privilegeObj;
    if (permission === 'all') {
      privilegeObjCopy[group][module].create = value;
      privilegeObjCopy[group][module].read = value;
      privilegeObjCopy[group][module].update = value;
      privilegeObjCopy[group][module].delete = value;
    } else {
      privilegeObjCopy[group][module][permission] = value;
    }
    setPrivilegeObj({
      ...privilegeObj,
      ...privilegeObjCopy,
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ pt: 4, pb: 5, px: 3 }}>
        <Grid container rowSpacing={2} columnSpacing={1}>
          <Grid item xs={12}>
            {' '}
            <RHFTextField name="name" label="Designation*" disabled={formDisable} />
          </Grid>
          <Grid item xs={12}>
            {' '}
            <RHFTextField
              name="description"
              label="Description*"
              multiline
              rows={3}
              disabled={formDisable}
            />
          </Grid>
        </Grid>

        <Stack spacing={2} sx={{ p: 3 }}>
          {privilege.map((group, index) => {
            let childItem = null;

            try {
              childItem = Object.keys(privilegeObj[group]);
            } catch (error) {
              /* empty */
            }

            if (!childItem || childItem.length === 0) return <></>;

            return (
              <Card key={index}>
                <Stack
                  key={index}
                  spacing={2}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="h5">{group.replaceAll('_', ' ').toUpperCase()}</Typography>
                  <Scrollbar>
                    <Table size="medium" sx={{ minWidth: 800 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>{}</TableCell>
                          <TableCell width="140px" align="center">
                            Full Access
                          </TableCell>
                          <TableCell width="140px" align="center">
                            Create
                          </TableCell>
                          <TableCell width="140px" align="center">
                            Update
                          </TableCell>
                          <TableCell width="140px" align="center">
                            View
                          </TableCell>
                          <TableCell width="140px" align="center">
                            Delete
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {childItem.map((moduleName, i) => {
                          const permissionObj = privilegeObj[group][moduleName];

                          return (
                            <TableRow key={i}>
                              <TableCell align="left">
                                {moduleName.replaceAll('_', ' ').toUpperCase()}
                              </TableCell>
                              <TableCell align="center">
                                <Checkbox
                                  disabled={formDisable}
                                  onChange={(e, value) => {
                                    handlePermissionCheckboxClick(group, moduleName, 'all', value);
                                  }}
                                  checked={
                                    permissionObj.create &&
                                    permissionObj.read &&
                                    permissionObj.update &&
                                    permissionObj.delete
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Checkbox
                                  disabled={formDisable}
                                  onChange={(e, value) => {
                                    handlePermissionCheckboxClick(
                                      group,
                                      moduleName,
                                      'create',
                                      value
                                    );
                                  }}
                                  checked={permissionObj.create}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Checkbox
                                  disabled={formDisable}
                                  onChange={(e, value) => {
                                    handlePermissionCheckboxClick(
                                      group,
                                      moduleName,
                                      'update',
                                      value
                                    );
                                  }}
                                  checked={permissionObj.update}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Checkbox
                                  disabled={formDisable}
                                  onChange={(e, value) => {
                                    handlePermissionCheckboxClick(group, moduleName, 'read', value);
                                  }}
                                  checked={permissionObj.read}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Checkbox
                                  disabled={formDisable}
                                  onChange={(e, value) => {
                                    handlePermissionCheckboxClick(
                                      group,
                                      moduleName,
                                      'delete',
                                      value
                                    );
                                  }}
                                  checked={permissionObj.delete}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </Stack>
              </Card>
            );
          })}
        </Stack>
        <Stack sx={{ ml: 1, width: 1, justifyContent: 'flex-start' }}>
          <RHFSwitch
            disabled={formDisable}
            name="status"
            labelPlacement="start"
            label={
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Status
              </Typography>
            }
          />
        </Stack>

        <Stack justifyContent="flex-end" direction="row" spacing={1} sx={{ p: 2 }}>
          <LoadingButton
            color="error"
            variant="contained"
            loading={loadingSave && isSubmitting}
            onClick={handleSaveAsDraft}
          >
            Cancel
          </LoadingButton>
          {isView ? (
            ''
          ) : (
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {isEdit ? 'Update ' : 'Add'}
            </LoadingButton>
          )}
        </Stack>
      </Box>
    </FormProvider>
  );
}
