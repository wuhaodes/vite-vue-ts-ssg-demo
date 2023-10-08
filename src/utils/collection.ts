import lodash from 'lodash'
import { type App } from 'vue'
import { timeout } from './index'
import request from './request'
import router from '@/router'
import useStore from '@/store'

function collectEls(fn: (...args: any) => void, selector = '[data-collected]') {
    const els = document.body.querySelectorAll(selector)
    for (const el of els) {
        el.addEventListener('click', (...args) => {
            setTimeout(() => { collectEls(fn, selector) }, 500)
            fn.call(el, ...args)
        })
    }
}

export default {
    source: 1,
    _init: false,
    _currentPage: null as any,
    _previousPage: null as any,
    _uid: null,
    isSending: false,
    init() {
        if (this._init) {
            return
        }
        this._init = true
        const self = this
        const throttleFn = lodash.throttle<(e: Event) => void>(function (this: Element) {
            const paramsStr: string = this.getAttribute('data-collected') || ''
            const params = paramsStr.split('&').reduce<Record<string, any>>((prev, current) => {
                const [key, val] = current.split('=')
                prev[key] = val
                return prev
            }, {})
            self.send(params)
        }, 1000, { trailing: true, leading: false })
        router.afterEach(async (to: Location, from: Location) => {
            const store = useStore()
            this._currentPage = to
            this._previousPage = from
            this._uid = store.getters.user?.userId || null
            await timeout(1200)
            // 标记埋点
            collectEls(throttleFn)
            // 全埋点
            // document.body.addEventListener('click', throttleFn, true)
        })
    },
    send(params: any) {
        const store = useStore()
        const path = this._currentPage?.fullPath || ''
        this._uid = store.getters.user?.userId || null
        const userId = this._uid

        params = { ...params, userId, path, loginSource: 1 }

        if (params.pv) {
            if (params.path == '/') {
                if (this.isSending) {
                    return
                }
                this.isSending = true
                return request({
                    method: 'post',
                    data: { ...params, menuIndex: path },
                    url: '/web/platformPv/add'
                }).finally(() => { this.isSending = false })
            }
            return
        }

        return request({
            method: 'post',
            data: params,
            url: '/web/buryingPoint/log/save'
        }).catch(console.error)
    },
    install(app: App) {
        app.config.globalProperties.$collection = this;
        (window as any).collection = this
    }
}
