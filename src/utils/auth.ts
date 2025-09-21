import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);

  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  userEnteredPassword: string,
  hashedPassword: string
) => {
  return bcrypt.compare(userEnteredPassword, hashedPassword);
};
