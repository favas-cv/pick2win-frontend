import { useEffect, useMemo, useRef } from 'react';

const OTP_LENGTH = 6;

export const OTPInput = ({
  value,
  onChange,
  disabled = false,
  autoFocus = true,
}) => {
  const inputsRef = useRef([]);
  const digits = useMemo(
    () => Array.from({ length: OTP_LENGTH }, (_, index) => value[index] || ''),
    [value]
  );

  useEffect(() => {
    if (autoFocus && !disabled) {
      inputsRef.current[0]?.focus();
    }
  }, [autoFocus, disabled]);

  const updateValue = (nextDigits) => {
    onChange(nextDigits.join('').replace(/\D/g, '').slice(0, OTP_LENGTH));
  };

  const handleChange = (index, event) => {
    const nextChars = event.target.value.replace(/\D/g, '').split('');
    if (!nextChars.length) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      updateValue(nextDigits);
      return;
    }

    const nextDigits = [...digits];
    nextChars.forEach((char, offset) => {
      if (index + offset < OTP_LENGTH) {
        nextDigits[index + offset] = char;
      }
    });
    updateValue(nextDigits);

    const nextIndex = Math.min(index + nextChars.length, OTP_LENGTH - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedDigits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pastedDigits) return;

    onChange(pastedDigits);
    inputsRef.current[Math.min(pastedDigits.length, OTP_LENGTH) - 1]?.focus();
  };

  return (
    <div className="grid grid-cols-6 gap-2" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputsRef.current[index] = node;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white text-center text-base font-black text-slate-900 outline-none transition focus:border-sports-green disabled:opacity-60"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default OTPInput;
