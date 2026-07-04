import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const RECAPTCHA_CONTAINER_ID = 'firebase-recaptcha-container';

let recaptchaVerifier = null;
let confirmationResult = null;
let verifiedUser = null;

const firebaseErrorMessages = {
  'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again.',
  'auth/code-expired': 'The OTP has expired. Please request a new code.',
  'auth/invalid-app-credential': 'Phone verification could not be started. Please try again.',
  'auth/invalid-phone-number': 'Enter a valid phone number.',
  'auth/invalid-verification-code': 'Incorrect OTP. Please check the code and try again.',
  'auth/missing-verification-code': 'Enter the OTP sent to your phone.',
  'auth/network-request-failed': 'Network error. Please check your connection and try again.',
  'auth/quota-exceeded': 'SMS limit reached. Please try again later.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
};

export const getFirebaseAuthErrorMessage = (error, fallback = 'Firebase phone verification failed. Please try again.') => {
  if (!error) return fallback;
  return firebaseErrorMessages[error.code] || error.message || fallback;
};

export const initializeRecaptcha = async (containerId = RECAPTCHA_CONTAINER_ID) => {
  if (recaptchaVerifier) return recaptchaVerifier;

  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error('reCAPTCHA container is missing.');
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
  });

  await recaptchaVerifier.render();
  return recaptchaVerifier;
};

export const sendOTP = async (phoneNumber) => {
  const verifier = await initializeRecaptcha();

  console.log('Firebase App initialized', Boolean(auth.app));
  console.log('Firebase Auth initialized', Boolean(auth));
  console.log('Project ID', auth.app?.options?.projectId);
  console.log('Auth Domain', auth.app?.options?.authDomain);
  console.log('Current hostname', window.location.hostname);
  console.log('Phone number being sent', phoneNumber);
  console.log('Whether RecaptchaVerifier is initialized', Boolean(verifier));

  try {
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    verifiedUser = null;
    return confirmationResult;
  } catch (error) {
    console.error('Firebase signInWithPhoneNumber error.code', error?.code);
    console.error('Firebase signInWithPhoneNumber error.message', error?.message);
    console.error('Firebase signInWithPhoneNumber error.customData', error?.customData);
    console.error('Firebase signInWithPhoneNumber full error object', error);
    throw error;
  }
};

export const verifyOTP = async (code) => {
  if (!confirmationResult) {
    throw new Error('Please request an OTP before verifying.');
  }

  const result = await confirmationResult.confirm(code);
  verifiedUser = result.user;
  return result;
};

export const getFirebaseIdToken = async () => {
  const user = verifiedUser || auth.currentUser;
  if (!user) {
    throw new Error('Phone verification is required before resetting your password.');
  }

  return user.getIdToken(true);
};

export const cleanupRecaptcha = () => {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
  }

  recaptchaVerifier = null;
  confirmationResult = null;
  verifiedUser = null;
};

export const firebaseAuthService = {
  initializeRecaptcha,
  sendOTP,
  verifyOTP,
  getFirebaseIdToken,
  cleanupRecaptcha,
  getFirebaseAuthErrorMessage,
};

export default firebaseAuthService;
