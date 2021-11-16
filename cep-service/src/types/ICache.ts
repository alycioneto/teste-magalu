export interface ICache {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, maxAge?: number): Promise<void>;
}
