import { AbstractRepository } from "./interface";

export class InMemmoryRepository<T> implements AbstractRepository<T> {
  private records: Record<string, T>;

  constructor() {
    this.records = {};
  }

  async addEntry(key: string, data: T): Promise<void> {
    this.records[key] = data;
  }

  async getEntry(key: string): Promise<T | null> {
    const application = this.records[key];
    return application;
  }

  async deleteEntry(loginName: string): Promise<void> {
    delete this.records[loginName];
  }
}

// async getEntryByToken(key: string): Promise<T | null> {
//   for (const a of Object.values(this.records)) {
//     if (a.token === key) {
//       return a;
//     }
//   }

//   return null;
// }
