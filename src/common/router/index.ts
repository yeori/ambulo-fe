import util from '@/service/util/index.js'
import page from 'page'
import { writable, type Subscriber, type Writable, get } from 'svelte/store'
const update = util.svelteStore.helpUpdate

const routeMiddleware = (router: Router, ctx: any, next: Function) => {
  update(router.store, (store) => {
    store.params = ctx.params
    store.path = ctx.path
  })
  next()
}

export type IRouter = {
  path: string
  params: any
  component: any
}
export class Router {
  store: Writable<IRouter>
  constructor() {
    this.store = writable({
      path: undefined,
      params: undefined,
      component: undefined
    })
  }
  push(path: string): Promise<void> {
    page.show(path)
    return Promise.resolve()
  }
  intParam(paramName) {
    return this.getParam(paramName, (v) => Number.parseInt(v))
  }
  getParam(paramName, conv: Function) {
    const { params } = get(this.store)
    const v = params[paramName]
    return conv(v)
  }
  subscribe(callback: Subscriber<IRouter>) {
    return this.store.subscribe(callback)
  }
  bind(path: string, component: any) {
    page(
      path,
      (ctx: page.Context, next) => routeMiddleware(this, ctx, next),
      () => {
        update(this.store, (store) => {
          store.component = component
        })
      }
    )
  }
  start() {
    page.start()
  }
}

const createRouter = () => new Router()
const router = createRouter()
export default router
