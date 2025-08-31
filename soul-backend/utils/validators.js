export const isEmpty = (str) => !str || str.trim().length === 0;

export const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};
