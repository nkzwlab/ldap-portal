import { InMemmoryRepository } from "../core";
import { Application, ApplicationRepository } from "./interface";

export class InMemmoryApplicationRepository
  extends InMemmoryRepository<Application>
  implements ApplicationRepository
{
  async getApplicationByToken(token: string): Promise<Application | null> {
    const entry = this.records[token];
    if (typeof entry === "undefined") {
      return null;
    }

    return entry;
  }

  async getApplicationByLoginName(
    loginName: string
  ): Promise<Application | null> {
    const apps = Object.values(this.records);

    return (
      apps.find((application) => application.loginName === loginName) ?? null
    );
  }
}
