import { Application, ApplicationRepository } from "./interface";

export class InMemmoryRepository implements ApplicationRepository {
  private records: Record<Application["loginName"], Application>;

  constructor() {
    this.records = {};
  }

  addApplication(application: Application): void {
    this.records[application.loginName] = application;
  }

  getApplication(loginName: string): Application | null {
    const application = this.records[loginName];
    return application;
  }

  getApplicationByToken(token: string): Application | null {
    for (const a of Object.values(this.records)) {
      if (a.token === token) {
        return a;
      }
    }

    return null;
  }

  deleteApplication(loginName: string): void {
    delete this.records[loginName];
  }
}
