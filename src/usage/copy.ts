import Clipboard from 'clipboard'
import { ElMessage } from 'element-plus'

export default function () {
    function copy(cpText: string, { success, successText, errorText, error }: CopyOptions) {
        if (!cpText) {
            return
        }
        const successFn = success || (() => ElMessage.success(successText || '复制成功'))
        const errorFn = error || ((e: Event) => { console.error(errorText || e) })
        const button = document.createElement('button')
        button.style.cssText = 'display:none;'
        button.setAttribute('data-clipboard-text', cpText)
        document.body.appendChild(button)
        let cd: Clipboard | null
        cd = new Clipboard(button)
        cd.on('success', successFn)
        cd.on('error', errorFn)
        button.click()
        setTimeout(() => {
            button.remove()
            cd = null
        }, 500)
    }

    return { copy }
}
