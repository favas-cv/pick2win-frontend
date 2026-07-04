import { useCallback, useEffect, useState } from 'react';
import {
  cleanupRecaptcha,
  getFirebaseAuthErrorMessage,
  getFirebaseIdToken,
  sendOTP,
  verifyOTP,
} from '../services/firebaseAuth';

const RESEND_SECONDS = 60;

export const useFirebaseOTP = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [canUseFallback, setCanUseFallback] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  useEffect(() => {
    if (!resendSeconds) return undefined;

    const timer = window.setInterval(() => {
      setResendSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  useEffect(() => cleanupRecaptcha, []);

  const requestOTP = useCallback(async (phoneNumber) => {
    setSending(true);
    setError('');
    setCanUseFallback(false);

    try {
      await sendOTP(phoneNumber);
      setOtpSent(true);
      setVerified(false);
      setResendSeconds(RESEND_SECONDS);
      return true;
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err, 'SMS send failed. Please try again.'));
      setCanUseFallback(true);
      return false;
    } finally {
      setSending(false);
    }
  }, []);

  const confirmOTP = useCallback(async (code) => {
    if (code.length !== 6) {
      setError('Enter the 6 digit OTP.');
      return false;
    }

    setVerifying(true);
    setError('');

    try {
      await verifyOTP(code);
      setVerified(true);
      setCanUseFallback(false);
      return true;
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err, 'Incorrect or expired OTP. Please try again.'));
      setCanUseFallback(true);
      return false;
    } finally {
      setVerifying(false);
    }
  }, []);

  return {
    otpSent,
    verified,
    sending,
    verifying,
    error,
    canUseFallback,
    resendSeconds,
    canResend: otpSent && resendSeconds === 0 && !sending && !verifying,
    requestOTP,
    confirmOTP,
    getFirebaseIdToken,
    setError,
  };
};

export default useFirebaseOTP;
