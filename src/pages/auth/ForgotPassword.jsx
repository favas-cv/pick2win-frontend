import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ChevronLeft, Eye, EyeOff, KeyRound, Lock, RotateCw } from 'lucide-react';
import OTPInput from '../../components/OTPInput';
import PhoneInput from '../../components/common/PhoneInput';
import useFirebaseOTP from '../../hooks/useFirebaseOTP';
import authService from '../../services/authService';
import { getApiErrorMessage } from '../../utils/apiError';
import { stripPhoneSpaces } from '../../utils/phone';

const DEFAULT_COUNTRY_CODE = '+91';

const toFirebasePhoneNumber = (phone) => {
  const countryCode = import.meta.env.VITE_FIREBASE_PHONE_COUNTRY_CODE || DEFAULT_COUNTRY_CODE;
  return `${countryCode}${phone}`;
};

const phoneExistsInResponse = (data) => {
  if (typeof data === 'boolean') return data;
  if (!data || typeof data !== 'object') return false;

  const value = data.exists ?? data.phone_exists ?? data.found ?? data.is_registered ?? data.success;
  return Boolean(value);
};

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({ mode: 'onChange' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [fallbackLoading, setFallbackLoading] = useState(false);
  const [fallbackRequested, setFallbackRequested] = useState(false);
  const [apiError, setApiError] = useState('');
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    otpSent,
    verified,
    sending,
    verifying,
    error: otpError,
    canUseFallback,
    resendSeconds,
    canResend,
    requestOTP,
    confirmOTP,
    getFirebaseIdToken,
    setError: setOtpError,
  } = useFirebaseOTP();

  const combinedError = apiError || otpError;
  const canShowFallback = Boolean(phone) && (canUseFallback || otpSent);
  const isBusy = loading || sending || verifying || resetting || fallbackLoading;

  const onSubmit = async (data) => {
    const compactPhone = stripPhoneSpaces(data.phone);
    setApiError('');
    setOtpError('');
    setFallbackRequested(false);
    setLoading(true);

    try {
      const response = await authService.checkForgotPasswordPhone(compactPhone);
      if (!phoneExistsInResponse(response)) {
        setApiError('No account was found with this phone number.');
        return;
      }

      setPhone(compactPhone);
      await requestOTP(toFirebasePhoneNumber(compactPhone));
    } catch (err) {
      setApiError(getApiErrorMessage(err, 'Could not check this phone number. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const verifiedOtp = await confirmOTP(otp);
    if (verifiedOtp) {
      setApiError('');
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || !phone) return;
    setOtp('');
    await requestOTP(toFirebasePhoneNumber(phone));
  };

  const handleResetPassword = async (data) => {
    if (!verified) return;

    setApiError('');
    setResetting(true);

    try {
      const firebase_id_token = await getFirebaseIdToken();
      await authService.resetPasswordWithFirebase({
        phone,
        firebase_id_token,
        password: data.password,
      });
      setSuccess(true);
      window.setTimeout(() => navigate('/login/user'), 1200);
    } catch (err) {
      setApiError(getApiErrorMessage(err, 'Could not reset your password. Please try again.'));
    } finally {
      setResetting(false);
    }
  };

  const handleFallbackRequest = async () => {
    if (!phone) return;

    setFallbackLoading(true);
    setApiError('');

    try {
      await authService.requestPasswordReset(phone);
      setFallbackRequested(true);
    } catch (err) {
      setApiError(getApiErrorMessage(err, 'Could not request club admin support. Please try again.'));
    } finally {
      setFallbackLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div id="firebase-recaptcha-container" />

      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">Reset password</h2>
        <p className="text-xs text-sports-gray mt-1 font-semibold">Verify your phone number to create a new password.</p>
      </div>

      {combinedError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{combinedError}</span>
        </div>
      )}

      {success ? (
        <div className="space-y-4">
          <div className="bg-sports-green/10 border border-sports-green/20 text-sports-green text-xs p-4 rounded-xl flex items-start gap-2.5 leading-relaxed">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold block text-sm">Password updated!</span>
              Your password has been reset. Redirecting you to sign in.
            </div>
          </div>
          <Link
            to="/login/user"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" /> Return to Sign In
          </Link>
        </div>
      ) : fallbackRequested ? (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 text-slate-700 text-xs p-5 rounded-xl shadow-sm text-center leading-relaxed">
            <div className="w-11 h-11 bg-sports-green/10 border border-sports-green/20 text-sports-green rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="block text-sm font-black text-slate-900">Club admin is verifying you</span>
            <span className="block mt-2 font-bold text-slate-900">{phone}</span>
            <span className="block mt-2">
              You can get a reset link through your WhatsApp. Thank you and please wait.
            </span>
            <span className="block mt-2 text-slate-500">
              If it takes too long, contact the club admin.
            </span>
          </div>
          <Link
            to="/login/user"
            className="w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      ) : verified ? (
        <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1.5">New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sports-gray">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  {...register('password', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-sports-green focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sports-gray hover:text-slate-900"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <span className="text-[10px] text-red-500 block mt-1">{errors.password.message}</span>}
            </div>

            <div>
              <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1.5">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sports-gray">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  {...register('confirmPassword', {
                    required: 'Confirm your new password',
                    validate: (value) => value === getValues('password') || 'Passwords do not match',
                  })}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-sports-green focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sports-gray hover:text-slate-900"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <span className="text-[10px] text-red-500 block mt-1">{errors.confirmPassword.message}</span>}
            </div>
          </div>

          <button
            type="submit"
            disabled={resetting}
            className="w-full bg-sports-green hover:bg-sports-greenDark disabled:opacity-50 text-white text-sm font-black py-3 rounded-xl transition shadow-lg shadow-sports-green/10 flex items-center justify-center gap-1.5 active:scale-98"
          >
            {resetting ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <KeyRound className="w-4 h-4" /> Reset Password
              </>
            )}
          </button>
        </form>
      ) : otpSent ? (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-2">Enter 6 Digit OTP</label>
            <OTPInput value={otp} onChange={setOtp} disabled={verifying} />
          </div>

          <button
            type="button"
            onClick={handleVerifyOTP}
            disabled={verifying || otp.length !== 6}
            className="w-full bg-sports-green hover:bg-sports-greenDark disabled:opacity-50 text-white text-sm font-black py-3 rounded-xl transition shadow-lg shadow-sports-green/10 flex items-center justify-center gap-1.5 active:scale-98"
          >
            {verifying ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Verify OTP'
            )}
          </button>

          <button
            type="button"
            onClick={handleResendOTP}
            disabled={!canResend}
            className="w-full border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-sports-gray hover:text-slate-900 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <RotateCw className="w-4 h-4" />
            {resendSeconds ? `Resend OTP in ${resendSeconds}s` : 'Resend OTP'}
          </button>

          {canShowFallback && (
            <button
              type="button"
              onClick={handleFallbackRequest}
              disabled={fallbackLoading}
              className="w-full border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-900 text-xs font-bold py-2.5 rounded-xl transition"
            >
              {fallbackLoading ? 'Requesting...' : 'Did not get OTP? Request Club Admin'}
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PhoneInput
            register={register}
            errors={errors}
            inputClassName="bg-white border-slate-200 focus:border-sports-green"
          />

          <button
            type="submit"
            disabled={isBusy}
            className="w-full bg-sports-green hover:bg-sports-greenDark disabled:opacity-50 text-white text-sm font-black py-3 rounded-xl transition shadow-lg shadow-sports-green/10 flex items-center justify-center gap-1.5 active:scale-98"
          >
            {loading || sending ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Send OTP'
            )}
          </button>

          {canShowFallback && (
            <button
              type="button"
              onClick={handleFallbackRequest}
              disabled={fallbackLoading}
              className="w-full border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-900 text-xs font-bold py-2.5 rounded-xl transition"
            >
              {fallbackLoading ? 'Requesting...' : 'Did not get OTP? Request Club Admin'}
            </button>
          )}

          <Link
            to="/login/user"
            className="w-full border border-slate-200 hover:bg-slate-50 text-sports-gray hover:text-slate-900 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
