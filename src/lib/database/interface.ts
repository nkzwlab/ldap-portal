export interface ApplicationRepository {
  addApplication(application: Application): void;
  getApplication(loginName: string): Application;
  getApplicationByToken(token: string): Application;
  deleteApplication(loginName: string): void;
}

export type Application = {
  loginName: string;
  email: string;
  token: string;
};
