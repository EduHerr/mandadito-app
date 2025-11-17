export const onlyNumbers = (value: string): boolean => {
  if (!/[0-9]/.test(value)) {
    return false;
  }

  return true;
};
