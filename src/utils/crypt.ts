import bcrypt from "bcrypt";

const BCRYPT_SALT_ROUNDS = 12;

export const checkPassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
};
