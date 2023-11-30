import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
// utils
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { getDataFromApi, putDataFromApi } from '../../../utils/apiCalls';
import { bgBlur } from '../../../utils/cssStyles';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
import Image from '../../../components/image';
import { CustomAvatar } from '../../../components/custom-avatar';
import FormProvider, { RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  '&:before': {
    ...bgBlur({
      color: theme.palette.primary.darker,
    }),
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
}));

const StyledInfo = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

ProfileImage.propTypes = {
  currentUser: PropTypes.object,
  cover: PropTypes.string,
  name: PropTypes.string,
  role: PropTypes.string,
};
let USER_SELECTED_PROFILE = null;

export default function ProfileImage({ name, role, cover, currentUser }) {
  const { user } = useAuthContext();
  const [employee, setEmployee] = useState([]);
  const { EmpId } = useParams();
  console.log('53', EmpId);
  const EmpSchema = Yup.object().shape({
    avatarbase64: Yup.string().required('Avatar is required').nullable(true),
    name: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      avatarbase64: currentUser?.avatarbase64 || '',
      name: currentUser?.name || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(EmpSchema),
    defaultValues,
  });

  const { reset, watch, control, setValue, handleSubmit } = methods;
  // eslint-disable-next-line arrow-body-style
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      USER_SELECTED_PROFILE = acceptedFiles[0];
      const base64 = await convertBase64(USER_SELECTED_PROFILE);
      if (USER_SELECTED_PROFILE) {
        setValue('avatarbase64', base64, { shouldValidate: true });
      }
    },
    [setValue]
  );
  const values = watch();
  function getEmployeeById() {
    getDataFromApi(`employee/${EmpId}`).then((res) => {
      setEmployee('113', res.data);
      Object.keys(res.data).forEach((item) => setValue(item, res.data[item]));
      setValue('aadhaarCard', res.data.aadhaarCard);
      console.log('employee details', res);
    });
  }

  const onSubmit = async (data) => {
    await putDataFromApi(`employee/update`, JSON.stringify(data));

    reset();
    // enqueueSnackbar('Update success!');
    // navigate(PATH_DASHBOARD.employee.list);
  };

  useEffect(() => {
    getEmployeeById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <StyledRoot>
        <StyledInfo>
          {/* <CustomAvatar
            // src={user?.photoURL}
            // alt={user?.displayName}
            // name={user?.displayName}
            sx={{
              mx: 'auto',
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: 'common.white',
              width: { xs: 80, md: 128 },
              height: { xs: 80, md: 128 },
            }}
          /> */}
          <RHFUploadAvatar
            name="avatarbase64"
            maxSize={520000}
            onDrop={handleDrop}
            sx={{
              mx: 'auto',
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: 'common.white',
              width: { xs: 80, md: 128 },
              height: { xs: 80, md: 128 },
            }}
          />

          <Box
            sx={{
              ml: { md: 3 },
              mt: { xs: 1, md: 0 },
              color: 'common.white',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Typography variant="h4">Anurag</Typography>

            <Typography sx={{ opacity: 0.72 }}>Developer</Typography>
          </Box>
        </StyledInfo>

        <Image
          alt="cover"
          src={cover}
          sx={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
          }}
        />
      </StyledRoot>
    </FormProvider>
  );
}
