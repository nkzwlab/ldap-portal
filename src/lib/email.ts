import { env } from "./env";

export const emailFromLoginName = (
  loginName: string,
  emailDomain: string = env.defaultEmailDomain
): string => {
  return `${loginName}@${emailDomain}`;
};
