import { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Link, Typography } from '@mui/material';
import { SentIcon } from '../../assets/icons';
import { postDataToApi } from '../../utils/apiCalls';
import { useSnackbar } from '../../components/snackbar';
import Iconify from '../../components/iconify';
import AuthNewPasswordForm from '../../sections/auth/AuthNewPasswordForm';
import { PATH_AUTH } from '../../routes/paths';

export default function NewPasswordPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState(null);

  const reSendOTP = () => {
    postDataToApi('auth/resend-otp').then((res) => {
      if (res.result) {
        console.log(res, 'res');
        enqueueSnackbar('Resend OTP in your Email Box!');
      }
    });
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem('Email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title> New Password | HRMS</title>
      </Helmet>

      <SentIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" paragraph>
        Request sent successfully!
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        We&apos;ve sent a 4-digit confirmation email to your email.
        <br />
        Please enter the code in the box below to verify your email.
      </Typography>

      {email !== null ? (
        <AuthNewPasswordForm Email={email} />
      ) : (
        ''
      )}

      <Link
        component={RouterLink}
        to={PATH_AUTH.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          mx: 'auto',
          mt: 2,
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:chevron-left-fill" width={16} />
        Return to sign in
      </Link>
    </>
  );
}
