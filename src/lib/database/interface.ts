export interface ApplicationRepository {
  addApplication(application: Application): Promise<void>;
  getApplication(loginName: string): Promise<Application | null>;
  getApplicationByToken(token: string): Promise<Application | null>;
  deleteApplication(loginName: string): Promise<void>;
}

export type Application = {
  loginName: string;
  email: string;
  token: string;
};
