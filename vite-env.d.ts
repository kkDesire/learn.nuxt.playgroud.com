/// <reference types="vite/client" />
interface ImportMeta {
  glob: (pattern: string | string[], options?: { query?: string, eager?: boolean, import?: 'default' | 'raw' }) => Record<string, string>
  readonly hot?: {
    accept: (callback: () => void) => void
    accept: (callback: () => void) => void
    dispose: (callback: (data: any) => void) => void
  }
}
