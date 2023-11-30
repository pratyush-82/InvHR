import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { useAuthContext } from '../../auth/useAuthContext';
import { postDataToApi } from '../../utils/apiCalls';
import { useSnackbar } from '../../components/snackbar';

// ----------------------------------------------------------------------

export default function AuthResetPasswordForm() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: '' },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const response = await postDataToApi(`auth/forgot-password`, JSON.stringify(data));
    if (response.result) {
      console.log('response.result', response);
      localStorage.setItem('otpToken', response.data.otpToken);
      localStorage.setItem('Email', response.data.email);
      reset();
      enqueueSnackbar('Send OTP in your Mail Box!');
      navigate(PATH_AUTH.newPassword);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <RHFTextField name="email" label="Email address" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ mt: 3 }}
      >
        Send Request
      </LoadingButton>
    </FormProvider>
  );
}
