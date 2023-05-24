import type { Writable } from 'svelte/store'

const rand = {
  pick: (arr: any[]): any => {
    let idx = Math.floor(Math.random() * arr.length)
    return arr[idx]
  },
  nextInt: (limit: number): number => {
    return Math.floor(Math.random() * limit)
  }
}

const PRIMITIVE_TYPE = 'number,string,boolean'
const type = {
  isPrimitive: (val: any) => {
    const type = typeof val
    return PRIMITIVE_TYPE.includes(type)
  }
}

const array = {
  /**
   *
   * @param arr input elements
   * @param fnKey key type of each element
   * @param fnVal value extracter from each element
   * @returns map
   */
  partition: <T, U, K>(
    arr: T[],
    fnKey: (elem: T) => K,
    fnVal?: (elem: T) => U
  ): Map<K, U[]> => {
    const wrapper = new Map<K, U[]>()
    arr.forEach((elem) => {
      const key: K = fnKey(elem)
      const val: U = fnVal(elem)
      let elems = wrapper.get(key)
      if (!elems) {
        elems = []
        wrapper.set(key, elems)
      }
      elems.push(val)
    })
    return wrapper
  }
}
const svelteStore = {
  helpUpdate: <T>(store: Writable<T>, callback?: (store: T) => T | void) => {
    store.update((store: T) => {
      const next = callback ? callback(store) : undefined
      return next || store
    })
  }
}
export default {
  rand,
  type,
  array,
  svelteStore
}
