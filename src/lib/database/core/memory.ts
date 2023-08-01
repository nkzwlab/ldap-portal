import { AbstractRepository } from "./interface";

export class InMemmoryRepository<T> implements AbstractRepository<T> {
  protected records: Record<string, T>;

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

  async deleteEntry(key: string): Promise<void> {
    delete this.records[key];
  }
}
