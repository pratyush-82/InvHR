/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Link,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Grid,
  Box,
  Button,
  fabClasses,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { useSnackbar } from '../../components/snackbar';
import { PATH_AUTH, PATH_DASHBOARD } from '../../routes/paths';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { postDataToApi } from '../../utils/apiCalls';
import { getLoggedInAdmin, saveAdmin } from '../../auth/utils';

// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [idError, setIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setisLoading] = useState(false)

  const { enqueueSnackbar } = useSnackbar();

  const LoginSchema = Yup.object().shape({
    empId: Yup.string().required('please Enter EmpId'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    empId: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
      setisLoading(true)
    try {
      const res = await postDataToApi(`auth/login`, JSON.stringify(data));

      if (res.result && res.data) {
        console.log(res);
        localStorage.setItem('empId', res.data.empId);
        saveAdmin(res.data);

        const state = {
          empId: res.data.empId,
          token: res.data.token,
        };

        setTimeout(() => {
          if (getLoggedInAdmin().policyAgreed === false) {
            localStorage.setItem('state', JSON.stringify(state));
            navigate(PATH_AUTH.policyAgreement);
          } else {
            window.location.href = PATH_DASHBOARD.general.app;
            enqueueSnackbar(res.message, { variant: 'success' });
          }
        }, 1000);
      } else {
        enqueueSnackbar(res.message, { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message || error,
      });
    }
    setTimeout(() => {
      setisLoading(false)
    }, 1000);
  };

  useEffect(() => {
    setIdError(formState.errors.empId?.message ?? '');
    setPasswordError(formState.errors.password?.message ?? '');
  }, [formState.errors.empId?.message, formState.errors.password?.message]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">Invalid Credentials</Alert>}

        <RHFTextField
          name="empId"
          label="Employee Id"
          error={Boolean(idError)}
          helperText={idError}
        />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          error={Boolean(passwordError)}
          helperText={passwordError}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          '& > *': {
            // my: 2,
          },
        }}
      >
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 2 }}>
          <Grid item xs={8}>
            <Link
              component={RouterLink}
              to={PATH_AUTH.resetPassword}
              variant="body2"
              // color="inherit"
              underline="hover"
            >
              Forgot password?
            </Link>
          </Grid>
          <Grid item xs={4}>
            <LoadingButton
              fullWidth
              // color="inherit"
              size="small"
              type="submit"
              variant="contained"
              loading={isLoading}
            >
              Sign in
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  );
}
