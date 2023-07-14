import { Application, ApplicationRepository } from "./interface";

export class InMemmoryRepository implements ApplicationRepository {
  private records: Record<Application["loginName"], Application>;

  constructor() {
    this.records = {};
  }

  async addApplication(application: Application): Promise<void> {
    this.records[application.loginName] = application;
  }

  async getApplication(loginName: string): Promise<Application | null> {
    const application = this.records[loginName];
    return application;
  }

  async getApplicationByToken(token: string): Promise<Application | null> {
    for (const a of Object.values(this.records)) {
      if (a.token === token) {
        return a;
      }
    }

    return null;
  }

  async deleteApplication(loginName: string): Promise<void> {
    delete this.records[loginName];
  }
}
