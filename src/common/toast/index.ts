import { writable } from 'svelte/store'
import i18n from '../i18n/index.js'

// const topMessages = writable([])
// const DIR = {
//   BOTTOM: 'bottom toast'
// }
let seq = 0
const removeToast = (toastElem) => {
  const { store } = toastElem
  store.update((messages) => {
    const idx = messages.findIndex((elem) => elem === toastElem)
    messages.splice(idx, 1)
    return messages
  })
}

const addToast = (toast) => {
  return setTimeout(() => {
    removeToast(toast)
  }, toast.duration)
}

export const enum ToastType {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  EMBED = 'EMBED'
}

class Toast {
  readonly seq: number
  readonly type: any
  message: ToastTemplate
  duration: any
  store: any
  _tid: NodeJS.Timeout
  constructor(type, template, duration, store) {
    this.seq = ++seq
    this.type = type
    this.message = template
    this.duration = duration
    this.store = store
    if (this.duration > 0) {
      this._tid = addToast(this)
    }
  }
  get title() {
    return this.message.title || ''
  }
  get bodies() {
    return this.message.parseBodies()
  }
  get actions() {
    return this.message.actions || []
  }
  get component() {
    return this.message.component
  }
  isComponentToast() {
    return !!this.message.component
  }
  hasTitle() {
    return !!this.message.title
  }
  hasAction() {
    const { actions } = this.message
    return actions && actions.length > 0
  }
  execute(cmd) {
    // if (this.message.run) {
    //   this.message.run(cmd, this)
    // }
  }
  getMessage() {
    const template = this.message
    const bodies = template.parseBodies()
    return bodies
  }
  hideNow() {
    if (this._tid) {
      clearTimeout(this._tid)
    }
    removeToast(this)
  }
}

const messages = writable<Array<Toast>>([])

export class ToastAction {
  cmd: string
  text: string
  run: (cmd: string) => void
  constructor(cmd: string, text: string, run: (cmd: string) => void) {
    this.cmd = cmd
    this.text = text
    this.run = run
  }
}
export class ToastTemplate {
  title?: any
  bodies?: Array<string>
  actions?: Array<ToastAction>
  component: any
  constructor({
    title = undefined,
    bodies,
    actions = [],
    component = undefined
  }) {
    this.title = title
    this.bodies = typeof bodies === 'string' ? bodies.split('\n') : bodies
    this.actions = actions || []
    this.component = component
  }
  parseBodies() {
    return this.bodies.map((body) =>
      body.startsWith('@') ? i18n.parse(body) : body
    )
  }
}

const _create = (type, message: string | ToastTemplate, duration = 3000) => {
  let store = messages

  const template =
    typeof message === 'string'
      ? new ToastTemplate({ bodies: [message] })
      : message
  const t = new Toast(type, template, duration, store)
  store.update((msgList) => {
    msgList.push(t)
    return msgList
  })
  // cloned.push(t)
  return t
}
const bottom = {
  /**
   *
   * @param {string|ToastTemplate} message
   * @param {number} duration
   * @returns
   */
  info: (message: string, duration: number) =>
    _create(ToastType.INFO, message, duration),
  /**
   *
   * @param {string|ToastTemplate} message
   * @param {number} duration
   * @returns
   */
  success: (message: string, duration: number) =>
    _create(ToastType.SUCCESS, message, duration),
  /**
   *
   * @param {string|ToastTemplate} message
   * @param {number} duration
   * @returns
   */
  warn: (message: string, duration: number) =>
    _create(ToastType.WARN, message, duration),
  /**
   *
   * @param {string|ToastTemplate} message
   * @param {number} duration
   * @returns
   */
  error: (message: string, duration: number) =>
    _create(ToastType.ERROR, message, duration)
}
const info = (message: string, duration = 3000) =>
  bottom.info(message, duration)
const warn = (message: string, duration = 3000) =>
  bottom.warn(message, duration)
const error = (message: string, duration = 3000) =>
  bottom.error(message, duration)
const watch = (callback) => messages.subscribe(callback)

export type EmbeddedToast = {
  component: any
  duration: number
}
const embed = ({ component, duration }: EmbeddedToast) => {
  const template = new ToastTemplate({ bodies: [], component })
  const t = new Toast(ToastType.EMBED, template, duration, messages)
  messages.update((msgList) => {
    msgList.push(t)
    return msgList
  })
}
/**
 *
 * @param {{
 *    title:string,
 *    bodies:string|string[],
 *    actions?: {cmd:string, text:string, run:(cmd) => void}[]
 * }} template
 * @param {number} duration
 */
export { Toast, messages }
export default {
  info,
  warn,
  error,
  watch,
  embed
}
