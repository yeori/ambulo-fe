import province from './province.js'
import permission from './permmission.js'
import { get, writable } from 'svelte/store'

const locale = writable({
  lang: 'ko'
})

export type Lang = {
  _: string
  ko: string
  en: string
  jp?: string
}

export const mappings = {
  permission,
  province
}

const msg = (propPath: string, prefix: string = '') => {
  const props = propPath.split('.')
  let target = mappings
  if (prefix) {
    target = mappings[prefix] || {}
  }
  let path = ''
  for (let i = 0; i < props.length; i++) {
    const value = target[props[i]]
    path += props[i] + '.'
    if (!value) {
      return `MISSING [${path}]`
    }
    target = value
  }
  if (target['_'] === undefined) {
    return `NOT_MSG[${propPath}] ${path}`
  }
  const { lang } = get(locale)
  let message = target[lang]
  // if (!message && target.ref) {
  //   return msg(target.ref)
  // } else {
  // }
  return message || `MISSING[${path}]`
}

const parse = (path) => {
  if (path.startsWith('@')) {
    return msg(path.substring(1))
  } else {
    return path
  }
}

export default {
  parse
}
