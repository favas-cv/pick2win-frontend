import { Phone } from 'lucide-react';
import { stripPhoneSpaces, validatePhoneDigits } from '../../utils/phone';

const defaultInputClassName = 'bg-slate-50 border-slate-200 focus:border-black';

export const PhoneInput = ({
  register,
  errors,
  inputClassName = defaultInputClassName,
}) => (
  <div>
    <label className="text-[10px] font-bold text-sports-gray uppercase tracking-wider block mb-1.5">Phone Number</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sports-gray">
        <Phone className="w-4 h-4" />
      </span>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="tel"
        maxLength={10}
        placeholder="9876543210"
        {...register('phone', {
          required: 'Phone number is required',
          setValueAs: stripPhoneSpaces,
          validate: validatePhoneDigits,
          onChange: (event) => {
            event.target.value = stripPhoneSpaces(event.target.value).replace(/\D/g, '').slice(0, 10);
          },
        })}
        className={`w-full border rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition ${inputClassName}`}
      />
    </div>
    {errors.phone && <span className="text-[10px] text-red-500 block mt-1">{errors.phone.message}</span>}
  </div>
);

export default PhoneInput;
