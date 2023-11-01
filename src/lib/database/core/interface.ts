export interface AbstractRepository<T> {
  addEntry(key: string, application: T): Promise<void>;
  getEntry(key: string): Promise<T | null>;
  getAllEntries(): Promise<T[]>;
  deleteEntry(key: string): Promise<void>;
}
