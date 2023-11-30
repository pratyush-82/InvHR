/* eslint-disable no-plusplus */

/* eslint-disable import/no-unresolved */
/* eslint-disable import/order */
// @mui
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { PropTypes } from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Link, Stack, Typography } from '@mui/material';
import { getDataFromApi, postDataToApi } from 'src/utils/apiCalls';
import Image from 'src/components/image/Image';
import PolicyLayout from 'src/layouts/policy/PolicyLayout';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import { RHFCheckbox } from 'src/components/hook-form';
import { useNavigate } from 'react-router';
import { PATH_AUTH, PATH_DASHBOARD } from 'src/routes/paths';

export default function PolicyAgreementList() {
  const navigate = useNavigate();
  const [empId, setempId] = useState('');
  const PolicyAgreementSchema = Yup.object().shape({
    policyAgreed: Yup.boolean(),
  });

  useEffect(() => {
    setempId(localStorage.getItem('empId'));
  }, []);

  const defaultValues = useMemo(
    () => ({
      policyAgreed: false,
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(PolicyAgreementSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    // eslint-disable-next-line no-unneeded-ternary
    data.policyAgreed = data.policyAgreed ? true : false;
    await postDataToApi(`employee/policyVerify`, JSON.stringify({ ...data, empId }));
    window.location.href = PATH_DASHBOARD.general.app;
  };

  const [data, setData] = useState([]);
  const getPolicies = () => {
    getDataFromApi(`policy/list`).then((res) => {
      setData(res.data);
    });
  };
  useEffect(() => {
    getPolicies();
  }, []);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <PolicyLayout>
        <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
          <Typography variant="h3" sx={{ mb: 2, maxWidth: 480, textAlign: 'center' }}>
            Welcome to InviHR
          </Typography>
        </Stack>
        <Stack spacing={3} sx={{ pb: 3, pr: 0 }}>
          {data.map((policy) => (
            <PolicyAgree key={policy.id} policy={policy} />
          ))}
        </Stack>

        <Stack justifyContent="center" direction="row" spacing={1} sx={{ p: 2 }}>
          <RHFCheckbox
            name="policyAgreed"
            label="I agree with Inevitable group terms and condition policy."
          />
          <Button type="submit" variant="contained" loading={isSubmitting}>
            Agree
          </Button>
        </Stack>
      </PolicyLayout>
    </FormProvider>
  );
}

// ------------------------------------------------------------
PolicyAgree.propTypes = {
  policy: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    document: PropTypes.string,
  }),
};
function PolicyAgree({ policy }) {
  const { name, description, document } = policy;

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
    <Stack direction="row" spacing={2}>
      <Image
        alt={name}
        src="/assets/icons/files/ic_document.svg"
        sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
      />

      <Box sx={{ minWidth: 240 }}>
        <>
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
    </Stack>
  );
}
