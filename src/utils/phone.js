export const stripPhoneSpaces = (value = '') => String(value).replace(/\s+/g, '');

export const validatePhoneDigits = (value = '') => {
  const compactPhone = stripPhoneSpaces(value);
  if (!/^\d*$/.test(compactPhone)) return 'Phone number must contain numbers only';
  return compactPhone.length === 10 || 'Phone number must be exactly 10 digits';
};
