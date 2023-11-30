/* eslint-disable no-plusplus */
/* eslint-disable no-useless-concat */
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Card, Typography, Stack, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { styled } from '@mui/material/styles';
import FormProvider from '../../../../components/hook-form';

// components
import { putDataFromApi } from '../../../../utils/apiCalls';
import { Upload } from '../../../../components/upload';
// ----------------------------------------------------------------------

ProfileGallery.propTypes = {
  currentemployee: PropTypes.object,
  thumbnail: PropTypes.bool,
};

let AADHAAR_SELECTED_FILE = null;
let PAN_SELECTED_FILE = null;
let BANK_SELECTED_FILE = null;
let DEGREE_SELECTED_FILE = null;

const StyledBlock = styled((props) => <Stack direction="row" alignItems="center" {...props} />)({
  minWidth: 72,
  flex: '1 1',
});

export default function ProfileGallery({ thumbnail, currentemployee }) {
  const { enqueueSnackbar } = useSnackbar();
  const [pan, setPan] = useState(null);
  const [aadhaar, setAadhaar] = useState(null);
  const [bank, setBank] = useState(null);
  const [EducationDegree, setEducationDegree] = useState(null);
  const [preview, setPreview] = useState(false);

  const EmpSchema = Yup.object().shape({
    aadhaarCard: Yup.string().nullable(true),
    panCard: Yup.string().nullable(true),
    bankDocument: Yup.string().nullable(true),
    degree: Yup.string().nullable(true),
  });

  function openBase64NewTab(base64Pdf) {
    const blob = base64toBlob(base64Pdf);
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, 'pdfBase64.pdf');
    } else {
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl);
    }
  }

  function base64toBlob(base64Data) {
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: 'application/pdf' });
  }

  const defaultValues = useMemo(
    () => ({
      aadhaarCard:
        currentemployee.aadhaarCard && currentemployee.aadhaarCard.length > 0
          ? currentemployee.aadhaarCard
          : '',
      panCard: currentemployee?.panCard || '',
      bankDocument: currentemployee?.bankDocument || '',
      degree: currentemployee?.degree || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentemployee]
  );

  useEffect(() => {
    if (currentemployee) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentemployee]);
  const methods = useForm({
    // resolver: yupResolver(EmpSchema),
    defaultValues,
  });

  const {
    reset,
    resetField,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    console.log('69', data);
    await putDataFromApi(`employee/update`, JSON.stringify(data));

    resetField();
    enqueueSnackbar('Update success!');
  };

  const handleDropAadhaarFile = useCallback(
    async (aadhaarFile) => {
      AADHAAR_SELECTED_FILE = aadhaarFile[0];
      console.log('AADHAAR', AADHAAR_SELECTED_FILE);
      const AadhaarCard = await convertBase64(AADHAAR_SELECTED_FILE);
      console.log('AadhaarCard', AadhaarCard);
      if (AADHAAR_SELECTED_FILE) {
        setValue('aadhaarCard', AadhaarCard, { shouldValidate: true });
        await putDataFromApi(
          `employee/update`,
          JSON.stringify({
            empId: currentemployee.empId,
            aadhaarCard: AadhaarCard,
            designation: currentemployee.designation,
          })
        );
      }
      if (AADHAAR_SELECTED_FILE) {
        setAadhaar(
          Object.assign(AADHAAR_SELECTED_FILE, {
            preview: URL.createObjectURL(AADHAAR_SELECTED_FILE),
          })
        );
      }
      enqueueSnackbar('Update success!');
    },
    [setValue, currentemployee.empId, enqueueSnackbar, currentemployee.designation]
  );

  const handleDropPANFile = useCallback(
    async (panFile) => {
      PAN_SELECTED_FILE = panFile[0];
      const PanCard = await convertBase64(PAN_SELECTED_FILE);
      if (PAN_SELECTED_FILE) {
        setValue('panCard', PanCard, { shouldValidate: true });
        await putDataFromApi(
          `employee/update`,
          JSON.stringify({
            empId: currentemployee.empId,
            panCard: PanCard,
            designation: currentemployee.designation,
          })
        );
      }
      if (PAN_SELECTED_FILE) {
        setPan(
          Object.assign(PAN_SELECTED_FILE, {
            preview: URL.createObjectURL(PAN_SELECTED_FILE),
          })
        );
      }
      enqueueSnackbar('Update success!');
    },
    [setValue, currentemployee.empId, enqueueSnackbar, currentemployee.designation]
  );
  const handleDropDegreeFile = useCallback(
    async (degreeFile) => {
      DEGREE_SELECTED_FILE = degreeFile[0];
      const EduDegree = await convertBase64(DEGREE_SELECTED_FILE);
      console.log(EduDegree, 'edudegree');
      if (DEGREE_SELECTED_FILE) {
        setValue('degree', EduDegree, { shouldValidate: true });
        await putDataFromApi(
          `employee/update`,
          JSON.stringify({
            empId: currentemployee.empId,
            degree: EduDegree,
            designation: currentemployee.designation,
          })
        );
      }
      if (DEGREE_SELECTED_FILE) {
        setEducationDegree(
          Object.assign(DEGREE_SELECTED_FILE, {
            preview: URL.createObjectURL(DEGREE_SELECTED_FILE),
          })
        );
      }
      enqueueSnackbar('Update success!');
    },
    [setValue, currentemployee.empId, enqueueSnackbar, currentemployee.designation]
  );

  const handleDropBankFile = useCallback(
    async (bankFile) => {
      BANK_SELECTED_FILE = bankFile[0];
      console.log('BANK', BANK_SELECTED_FILE);
      const BankDocument = await convertBase64(BANK_SELECTED_FILE);
      console.log('153', BankDocument);
      if (BANK_SELECTED_FILE) {
        setValue('bankDocument', BankDocument, { shouldValidate: true });
        await putDataFromApi(
          `employee/update`,
          JSON.stringify({
            empId: currentemployee.empId,
            bankDocument: BankDocument,
            designation: currentemployee.designation,
          })
        );
      }
      if (BANK_SELECTED_FILE) {
        setBank(
          Object.assign(BANK_SELECTED_FILE, {
            preview: URL.createObjectURL(BANK_SELECTED_FILE),
          })
        );
      }
      enqueueSnackbar('Update success!');
    },
    [setValue, currentemployee.empId, enqueueSnackbar, currentemployee.designation]
  );

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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              Instructions
            </Typography>
            &nbsp;
            <Box>
              <Stack flexDirection="column" spacing={2}>
                <StyledBlock sx={{ minWidth: 120 }}>
                  <li>Allowed *PDF</li>
                </StyledBlock>
                <StyledBlock sx={{ minWidth: 120 }}>
                  <li>max size of 4MB</li>
                </StyledBlock>
                <StyledBlock sx={{ minWidth: 120 }}>
                  <li>Automatic file upload upon selection</li>
                </StyledBlock>
              </Stack>
            </Box>
          </Card>
        </Grid>
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
                <Upload
                  thumbnail={preview}
                  name="aadhaarCard"
                  acceptedFiles={{ accept: '.pdf' }}
                  file={aadhaar}
                  onDrop={handleDropAadhaarFile}
                />
                {currentemployee.aadhaarCard.length > 0 && (
                  <Typography variant="body1">
                    <Link
                      component="span"
                      variant="subtitle2"
                      color="text.primary"
                      onClick={() =>
                        openBase64NewTab(
                          currentemployee.aadhaarCard.replace('data:application/pdf;base64,', '')
                        )
                      }
                    >
                      Aadhaar Card Document
                    </Link>
                  </Typography>
                )}
              </Stack>
              <Stack spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                  PAN Card
                </Typography>
                <Upload
                  name="panCard"
                  acceptedFiles={{ accept: '.pdf' }}
                  file={pan}
                  onDrop={handleDropPANFile}
                />
                {currentemployee.panCard.length > 0 && (
                  <Typography variant="body1">
                    <Link
                      component="span"
                      variant="subtitle2"
                      color="text.primary"
                      onClick={() =>
                        openBase64NewTab(
                          currentemployee.panCard.replace('data:application/pdf;base64,', '')
                        )
                      }
                    >
                      PAN Card Document
                    </Link>
                  </Typography>
                )}
              </Stack>
              <Stack spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                  Bank Document
                </Typography>
                <Upload
                  name="bankDocument"
                  acceptedFiles={{ accept: '.pdf' }}
                  file={bank}
                  onDrop={handleDropBankFile}
                />
                {currentemployee.bankDocument.length > 0 && (
                  <Typography variant="body1">
                    <Link
                      component="span"
                      variant="subtitle2"
                      color="text.primary"
                      onClick={() =>
                        openBase64NewTab(
                          currentemployee.bankDocument.replace('data:application/pdf;base64,', '')
                        )
                      }
                    >
                      Bank Document
                    </Link>
                  </Typography>
                )}
              </Stack>
              <Stack spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                  Degree Document
                </Typography>
                <Upload
                  name="degree"
                  acceptedFiles={{ accept: '.pdf' }}
                  file={EducationDegree}
                  onDrop={handleDropDegreeFile}
                />
                {currentemployee.degree.length > 0 && (
                  <Typography variant="body1">
                    <Link
                      component="span"
                      variant="subtitle2"
                      color="text.primary"
                      onClick={() =>
                        openBase64NewTab(
                          currentemployee.degree.replace('data:application/pdf;base64,', '')
                        )
                      }
                    >
                      Degree Document
                    </Link>
                  </Typography>
                )}
              </Stack>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

// ----------------------------------------------------------------------
