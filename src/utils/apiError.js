export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const data = error?.response?.data;

  if (!data) return fallback;
  if (typeof data === 'string') return data;

  const directMessage = data.error || data.detail || data.message || data.non_field_errors;
  if (Array.isArray(directMessage)) return directMessage.join(', ');
  if (directMessage) return String(directMessage);

  const firstFieldError = Object.values(data).find(Boolean);
  if (Array.isArray(firstFieldError)) return firstFieldError.join(', ');
  if (firstFieldError) return String(firstFieldError);

  return fallback;
};
