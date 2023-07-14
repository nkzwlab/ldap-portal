export interface ApplicationRepository {
  addApplication(application: Application): void;
  getApplication(loginName: string): Application | null;
  getApplicationByToken(token: string): Application | null;
  deleteApplication(loginName: string): void;
}

export type Application = {
  loginName: string;
  email: string;
  token: string;
};
