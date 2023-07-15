export interface ApplicationRepository {
  addApplication(application: Application): Promise<void>;
  getApplication(loginName: string): Promise<Application | null>;
  getApplicationByToken(token: string): Promise<Application | null>;
  deleteApplication(loginName: string): Promise<void>;
}

export type Application = {
  loginName: string;
  email: string;
  passwordHash: string;
  token: string;
};

export const applicationFromJson = (data: unknown): Application | null => {
  const keys: (keyof Application)[] = ["loginName", "email", "token"];
  const out: Application = {
    loginName: "",
    email: "",
    passwordHash: "",
    token: "",
  };

  for (const key of keys) {
    if (typeof (data as any)[key] === "undefined") {
      return null;
    }

    out[key] = (data as any)[key];
  }

  return out;
};
