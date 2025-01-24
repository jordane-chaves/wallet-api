export interface HashComparer {
  comparer(plain: string, hash: string): Promise<boolean>
}
