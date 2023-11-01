import { AbstractRepository } from "../core";

export interface ApplicationRepository extends AbstractRepository<Application> {
  getApplicationByToken(token: string): Promise<Application | null>;
}

export type Application = {
  loginName: string;
  email: string;
  passwordHash: string;
  token: string;
};

export const applicationFromJson = (data: unknown): Application | null => {
  const keys: (keyof Application)[] = [
    "loginName",
    "email",
    "passwordHash",
    "token",
  ];
  const optionalKeys: (typeof keys)[number][] = ["email"];
  const out: Application = {
    loginName: "",
    email: "",
    passwordHash: "",
    token: "",
  };

  for (const key of keys) {
    if (typeof (data as any)[key] === "undefined") {
      if (optionalKeys.includes(key)) {
        continue;
      }

      console.error(`applicationFromJson: Missing required property "${key}"`);
      return null;
    }

    out[key] = (data as any)[key];
  }

  return out;
};
