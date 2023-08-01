export interface AbstractRepository<T> {
  addEntry(key: string, application: T): Promise<void>;
  getEntry(key: string): Promise<T | null>;
  deleteEntry(key: string): Promise<void>;
}

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
