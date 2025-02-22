'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { EmailInboxIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form } from 'src/components/hook-form/form-provider';
import { RHFCode } from 'src/components/hook-form/rhf-code';
import { RHFTextField } from 'src/components/hook-form/rhf-text-field';
import { useState } from 'react';

// ----------------------------------------------------------------------

export const VerifySchema = zod.object({
  code: zod
    .string()
    .min(1, { message: 'Code is required!' })
    .length(6, { message: 'Code must be exactly 6 digits!' })
    .regex(/^\d+$/, { message: 'Code must contain only digits!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
});

// ----------------------------------------------------------------------

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:7272';

export function SplitVerifyView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const defaultValues = {
    code: code || '',
    email: searchParams.get('email') || '',
  };

  const methods = useForm({
    resolver: zodResolver(VerifySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError('');
      setSuccess('');

      console.log('Sending verification request to:', `${SERVER_URL}/api/auth/verify`);
      console.log('With data:', data);

      const response = await fetch(`${SERVER_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          code: data.code,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Verification failed');
      }

      const result = await response.json();
      setSuccess(result.message || 'Email verified successfully!');

      // Redirect to dashboard after successful verification
      setTimeout(() => {
        router.push(paths.dashboard.root);
      }, 2000);
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.message || 'Failed to verify email');
    }
  });

  const handleResendCode = async () => {
    try {
      setError('');
      setSuccess('');

      console.log('Sending resend code request to:', `${SERVER_URL}/api/auth/resend-verification`);

      const response = await fetch(`${SERVER_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: methods.getValues('email'),
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to resend verification code');
      }

      const result = await response.json();
      setSuccess(result.message || 'Verification code resent successfully!');
    } catch (error) {
      console.error('Resend code error:', error);
      setError(error.message || 'Failed to resend code');
    }
  };

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <EmailInboxIcon sx={{ height: 96 }} />

      <Stack spacing={1}>
        <Typography variant="h3">Please verify your email!</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          We have sent a 6-digit confirmation code to your email. Please enter the code below to verify
          your email address.
        </Typography>
      </Stack>

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <RHFTextField
            name="email"
            label="Email"
            placeholder="example@domain.com"
            InputLabelProps={{ shrink: true }}
          />

          <RHFCode name="code" />

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Verify
          </LoadingButton>

          <Typography variant="body2" align="center">
            {`Don't have a code? `}
            <Link
              variant="subtitle2"
              onClick={handleResendCode}
              sx={{
                cursor: 'pointer',
              }}
            >
              Resend code
            </Link>
          </Typography>

          <Link
            component={RouterLink}
            href={paths.dashboard.root}
            color="inherit"
            variant="subtitle2"
            sx={{
              mt: 3,
              mx: 'auto',
              alignItems: 'center',
              display: 'inline-flex',
            }}
          >
            <Iconify icon="eva:chevron-left-fill" width={16} />
            Return to Dashboard
          </Link>
        </Stack>
      </Form>
    </Stack>
  );
}
