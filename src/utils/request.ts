import {
  isArrayBuffer,
  isArrayBufferView,
  isBlob,
  isFormData,
  tansParams,
} from './index'
import { getToken, removeToken } from './auth'
import cache from './cache'
import { ElNotification } from 'element-plus'
import { saveAs } from 'file-saver'

const prefix = import.meta.env.VITE_APP_BASE_API
const fetchInterval = 500

function transferHeaders(headers: Record<string, any>) {
  const token = getToken()
  const hds = new Headers()
  for (const key in headers) {
    const val = headers[key]
    if (val != undefined && val != null && val != '') {
      continue
    }
    hds.append(key, headers[key])
  }
  token && hds.append('Authorization', `Bearer ${token}`)
  return hds
}

function isUniqRequest(config: Record<string, any>) {
  const now = Date.now()
  const fetchRecord = { ...config, time: now + fetchInterval }
  const fetchRecordKey = config.url

  const sessionFetchRecordMap = (cache.session.getJSON('fetchRecord') ||
    {}) as Record<string, any>
  const currentSessionFetchRecord = sessionFetchRecordMap[fetchRecordKey]
  // 无记录,有记录超出限定范围则可以继续请求
  if (
    !currentSessionFetchRecord ||
    currentSessionFetchRecord.time < Date.now()
  ) {
    sessionFetchRecordMap[fetchRecordKey] = fetchRecord
    cache.session.setJSON('fetchRecord', sessionFetchRecordMap)
    return true
  }
  return false
}

function requestInterceptor({
  method,
  url,
  params,
  data,
  headers: oHeaders,
}: RequestConfig) {
  params = params || {}
  data = data || {}
  const headers = transferHeaders(oHeaders || {})
  const qStr = tansParams(params).slice(0, -1)
  const joinKey = qStr ? (url.includes('?') ? '&' : '?') : ''
  url = prefix + `${url}${joinKey}${qStr}`

  const isNotJsonData =
    isBlob(data) ||
    isFormData(data) ||
    isArrayBuffer(data) ||
    isArrayBufferView(data)
  const body =
    method == 'get' ? undefined : isNotJsonData ? data : JSON.stringify(data)
  isNotJsonData || headers.append('Content-Type', 'application/json')
  return {
    url,
    config: {
      headers,
      method,
      body,
      credentials: 'same-origin',
      mode: 'cors',
    } as RequestInit,
  }
}

async function responseInterceptor(responseP: Promise<Response>) {
  const response = await responseP.catch(e => {
    throw e
  })

  // 请求成功但未返回任何结果
  const isEmpty = response.headers.get('Content-Length') === '0'
  if (isEmpty) {
    return { code: 200, data: true }
  }

  const isFile = response.headers.has('Content-Disposition')
  if (isFile) {
    return response as RequestBody
  }

  const res: RequestBody = await response.json()
  const { code, msg: message = '系统异常，请稍后重试!' } = res || {}
  if (code == 200) {
    return res
  }
  if (code == 401) {
    removeToken()
    ElNotification.error('无效的会话，或者会话已过期，请重新登录。')
    throw '无效的会话，或者会话已过期，请重新登录。'
  }
  ElNotification.error(message)
  throw message
}

export default async function request(requestConfig: RequestConfig) {
  const { config, url } = requestInterceptor(requestConfig)
  const requestInfo: Record<string, any> = { ...config, url }
  const isUniq = isUniqRequest(requestInfo)
  if (!isUniq) {
    ElNotification.error('数据正在处理，请勿重复提交')
    throw '数据正在处理，请勿重复提交'
  }
  return await responseInterceptor(fetch(new Request(url), config)).catch(e => {
    throw e
  })
}

export async function download(
  url: string,
  data: Record<string, any> = {},
  fileName: string = '',
  config: Record<string, any> = {}
) {
  const res = await request({ url, method: 'post', data, ...config }).catch(
    console.error
  )
  if (!res || !res.blob) {
    return
  }
  const headers = res.headers || new Headers()
  const filename = decodeURIComponent(headers.get('filename') || fileName)
  const bData = await res.blob()
  saveAs(new Blob([bData]), filename)
}
