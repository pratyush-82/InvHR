/* eslint-disable no-plusplus */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/order */
// @mui
import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { getDataFromApi } from 'src/utils/apiCalls';
import Image from 'src/components/image/Image';
import { convertDateTimeFormat } from 'src/utils/common';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import Iconify from 'src/components/iconify/Iconify';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';

export default function PoliciesListPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState([]);
  const getPolicies = () => {
    const policyList = [];
    getDataFromApi(`policy/list`).then((res) => {
      // eslint-disable-next-line array-callback-return
      res.data.map((policy) => {
        if (policy.status === 'active') {
          policyList.push(policy);
        }
      });

      console.log('polcies list', policyList);
      setData(policyList);
      setLoading(false);
    });
  };
  useEffect(() => {
    getPolicies();
  }, []);
  return (
    <>
      <Helmet>
        <title>Policies | HRMS</title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <Typography variant="h4" gutterBottom>
            Policies
          </Typography>
        </Stack>
        {loading && <LoadingScreen />}

        {data.length > 0 ? (
          <>
            {!loading && (
              <Card>
                <CardHeader>Policies</CardHeader>
                <Scrollbar>
                  <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
                    {data.map((policy) => (
                      <Policy key={policy.id} policy={policy} />
                    ))}
                  </Stack>
                </Scrollbar>
          
              </Card>
            )}
          </>
        ) : (
          <Card>
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                height: 1,
                textAlign: 'center',
                p: (theme) => theme.spacing(5, 2),
              }}
            >
              <Image
                disabledEffect
                alt="empty content"
                src="/assets/illustrations/illustration_empty_content.svg"
                sx={{ height: 240, mb: 3 }}
              />

              <Typography variant="h5" gutterBottom>
                No Policy
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No Policy Published here!
              </Typography>
            </Stack>
          </Card>
        )}
      </Container>
    </>
  );
}

// ------------------------------------------------------------
Policy.propTypes = {
  policy: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    document: PropTypes.string,
    date: PropTypes.string,
  }),
};
function Policy({ policy }) {
  const { name, description, document, date } = policy;

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
    <Stack direction="row" alignItems="center" spacing={2}>
      <Image
        alt={name}
        src="/assets/icons/files/ic_document.svg"
        sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
      />

      <Box sx={{ minWidth: 240 }}>
        <>
          {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ m: 1 }}>
            {' '} */}
          <Link
            color="inherit"
            variant="subtitle1"
            noWrap
            onClick={() => openBase64NewTab(document.replace('data:application/pdf;base64,', ''))}
          >
            {name}
          </Link>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} Wrap>
            {description}
          </Typography>
        </>
      </Box>
      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {convertDateTimeFormat(date)}
      </Typography>
    </Stack>
  );
}
