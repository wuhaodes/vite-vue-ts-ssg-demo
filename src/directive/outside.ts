function generateHandler(el: any, binding: any) {
    return function (e: any) {
        if (el.contains(e.target)) {
            return false
        }
        // 如果绑定的参数是函数，正常情况也应该是函数，执行
        if (binding.value && typeof binding.value === 'function') {
            binding.value(e)
        }
    }
}

export default {
    mounted(el: any, binding: any) {
        const handler = generateHandler(el, binding)
        // 用于销毁前注销事件监听
        el.__outside__ = handler
        // 添加事件监听
        document.addEventListener('click', handler)
    },
    beforeUnmount(el: any) {
        // 移除事件监听
        document.removeEventListener('click', el.__outside__)
        // 删除无用属性
        delete el.__outside__
    }
}
