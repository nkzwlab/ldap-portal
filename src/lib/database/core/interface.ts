export interface AbstractRepository<T> {
  addEntry(key: string, application: T): Promise<void>;
  getEntry(key: string): Promise<T | null>;
  deleteEntry(key: string): Promise<void>;
}
