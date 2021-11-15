export interface Cache {
  get(key: string): Promise<string | null>
  set(key: string, value: string, maxAge?: number): Promise<void>
}
