interface RequestConfig {
  url: string
  method: string
  data?: any
  params?: Record<string, any>
  headers?: Record<string, any>
}

interface RequestBody {
  msg?: string
  data?: any
  code?: number
  blob?: () => Promise<any>
  headers?: Headers
  [index: string | number]: any
}
