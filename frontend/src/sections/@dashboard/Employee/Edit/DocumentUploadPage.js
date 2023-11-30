/* eslint-disable no-plusplus */
/* eslint-disable no-useless-concat */
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Card, Typography, Stack, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import FormProvider from '../../../../components/hook-form';

// components
import { putDataFromApi } from '../../../../utils/apiCalls';
import { Upload } from '../../../../components/upload';
import Iconify from '../../../../components/iconify/Iconify';
// ----------------------------------------------------------------------

export default function DocumentUploadPage() {
  const [openConfirm, setOpenConfirm] = useState(false);

  const [openUploadFile, setOpenUploadFile] = useState(false);
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenUploadFile = () => {
    setOpenUploadFile(true);
  };

  const handleCloseUploadFile = () => {
    setOpenUploadFile(false);
  };
  return (
    // <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Stack spacing={1} sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Aadhaar Card
              </Typography>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                onClick={handleOpenUploadFile}
              >
                Upload
              </Button>
            </Stack>
          </Box>
        </Card>
      </Grid>
    </Grid>
    // </FormProvider>
  );
}

// ----------------------------------------------------------------------
