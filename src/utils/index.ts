import type { App } from 'vue'
import collection from './collection'

export function tansParams(params: Record<string, any>) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    const part = encodeURIComponent(propName) + '='
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (
            value[key] !== null &&
            value[key] !== '' &&
            typeof value[key] !== 'undefined'
          ) {
            const paramsStr = propName + '[' + key + ']'
            const subPart = encodeURIComponent(paramsStr) + '='
            result += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&'
      }
    }
  }
  return result
}

const _toString = Object.prototype.toString

// 获取原始类型
export function getType(data: any) {
  return _toString.call(data).slice(8, -1)
}

// 验证是否为blob格式
export function isBlob(data: any) {
  return getType(data) === 'Blob'
}

// 验证是否为FormData格式
export function isFormData(data: any) {
  return getType(data) === 'FormData'
}
// 验证是否为ArrayBuffer格式
export function isArrayBuffer(data: any) {
  return getType(data) === 'ArrayBuffer'
}
// 验证是否为ArrayBufferView格式
export function isArrayBufferView(data: any) {
  return getType(data) === 'ArrayBufferView'
}

export function filterEmpty(
  params: Record<string, any>,
  keys = [undefined, null, '']
) {
  const obj: Record<string, any> = {}
  for (const key in params) {
    const val = params[key]
    if (keys.findIndex(v => v === val) >= 0) {
      continue
    }
    obj[key] = val
  }
  return obj
}

export async function timeout(ms: number) {
  return await new Promise(resolve => setTimeout(resolve, ms))
}

export function cleanArray(actual: any[]) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param(json?: Record<string, any>) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

export default function (app: App<Element>) {
  app.use(collection)
}
