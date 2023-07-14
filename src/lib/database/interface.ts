export interface ApplicationRepository {
  addApplication(loginName: string, email: string, token: string): void;
  getApplication(loginName: string): void;
  getApplicationByToken(token: string): void;
  deleteApplication(loginName: string): void;
}
