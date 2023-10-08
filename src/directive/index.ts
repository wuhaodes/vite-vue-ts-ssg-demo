import type { App } from 'vue'
import outside from './outside'

export default (app: App<Element>) => {
    app.directive('outside', outside)
}
