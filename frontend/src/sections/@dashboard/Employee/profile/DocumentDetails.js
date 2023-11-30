/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
// @mui
import { Box, Card, Typography, Grid, Button, Stack } from '@mui/material';
// components
import Base64Downloader from 'common-base64-downloader-react';
import { Document, Page } from 'react-pdf';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify/Iconify';

// ----------------------------------------------------------------------

DocumentDetails.propTypes = {
  currentemployee: PropTypes.object,
};

const StyledIcon = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

export default function DocumentDetails({ currentemployee }) {
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ pt: 4, pb: 5, px: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Document Details
          </Typography>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Stack direction="row">
              {currentemployee.aadhaarCard.replace('data:application/pdf;base64,', '').length >
              0 ? (
                <StyledIcon icon="clarity:document-solid" />
              ) : (
                <StyledIcon icon="clarity:document-line" />
              )}

              <Typography variant="body2">
                <b>Aadhaar Card :</b> &nbsp;
                {currentemployee.aadhaarCard.replace('data:application/pdf;base64,', '').length >
                0 ? (
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
                ) : (
                  ''
                )}
              </Typography>
            </Stack>
            <Stack direction="row">
              {currentemployee.panCard.replace('data:application/pdf;base64,', '').length > 0 ? (
                <StyledIcon icon="clarity:document-solid" />
              ) : (
                <StyledIcon icon="clarity:document-line" />
              )}

              <Typography variant="body2">
                <b>PAN Card :</b> &nbsp;
                {currentemployee.panCard.replace('data:application/pdf;base64,', '').length > 0 ? (
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
                ) : (
                  ''
                )}
              </Typography>
            </Stack>
            <Stack direction="row">
              {currentemployee.panCard.replace('data:application/pdf;base64,', '').length > 0 ? (
                <StyledIcon icon="clarity:document-solid" />
              ) : (
                <StyledIcon icon="clarity:document-line" />
              )}

              <Typography variant="body2">
                <b> Education Degree :</b> &nbsp;
                {currentemployee.degree.replace('data:application/pdf;base64,', '').length > 0 ? (
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
                    Education Degree
                  </Link>
                ) : (
                  ''
                )}
              </Typography>
            </Stack>
            <Stack direction="row">
              {currentemployee.bankDocument.replace('data:application/pdf;base64,', '').length >
              0 ? (
                <StyledIcon icon="clarity:document-solid" />
              ) : (
                <StyledIcon icon="clarity:document-line" />
              )}

              <Typography variant="body2">
                <b> Bank Document :</b> &nbsp;
                {currentemployee.bankDocument.replace('data:application/pdf;base64,', '').length >
                0 ? (
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
                ) : (
                  ''
                )}
              </Typography>
            </Stack>
            {/* 
            <Button
              onClick={() =>
                openBase64NewTab(
                  currentemployee.panCard.replace('data:application/pdf;base64,', '')
                )
              }
            >
              Open
            </Button> */}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}
