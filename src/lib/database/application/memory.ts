import { InMemmoryRepository } from "../core";
import { Application, ApplicationRepository } from "./interface";

export class InMemmoryApplicationRepository
  extends InMemmoryRepository<Application>
  implements ApplicationRepository
{
  async getApplicationByToken(key: string): Promise<Application | null> {
    for (const a of Object.values(this.records)) {
      if (a.token === key) {
        return a;
      }
    }

    return null;
  }
}
