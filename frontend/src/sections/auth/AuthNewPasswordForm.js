import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { postDataToApi } from '../../utils/apiCalls';

// ----------------------------------------------------------------------

let OTPToken = null;
AuthNewPasswordForm.propTypes = {
  Email: PropTypes.string
};
export default function AuthNewPasswordForm(props) {
  const { Email } = props;
  useEffect(() => {
    OTPToken = localStorage.getItem('otpToken');
    console.log('OTPToken', OTPToken);
  }, []);

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);

  const emailRecovery =
    typeof window !== 'undefined' ? sessionStorage.getItem('email-recovery') : '';

  const changePasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
      otp: Yup.string()
      .required('OTP is required') 
  });





  const defaultValues = {
    otp: '',
    email: emailRecovery || '',
    password: '',
    otpToken: OTPToken,
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(changePasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    postDataToApi(`auth/update-password`, JSON.stringify({ ...data, otpToken: OTPToken })).then(
      (res) => {
        if (res.result) {
          navigate(PATH_DASHBOARD.root);
          enqueueSnackbar('Change password success!');
        } else {
          enqueueSnackbar('You have entered wrong OTP', {
            variant: 'error',
          });
        }
      }
    );
  };

  
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField
          name="email"
          label={Email}
          disabled
        />
        <RHFTextField
          name="otp"
          label="OTP"
          type="Text"
        />
        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
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
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ mt: 3 }}
        >
          Update Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
