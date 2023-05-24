export class StorageWrapper {
  target: Storage

  constructor(target: Storage) {
    this.target = target
  }

  init(key: string, fn: (val: any) => void) {
    const val = this.get(key)
    fn(val)
    return key
  }
  /**
   *
   * @param {String} key
   * @param {any} alternateValue
   * @returns
   */
  get(key: string, alternateValue?: any) {
    const value = this.target.getItem(key)
    if (value) {
      return JSON.parse(value)
    } else {
      return alternateValue || value
    }
  }
  remove(keys: string[]): any {
    const values = {}
    keys.forEach((key) => {
      values[key] = this.get(key)
      this.target.removeItem(key)
    })
    return values
  }
  /**
   *
   * @param {String} key
   * @param {any} value
   * @param {boolean} overwrite if true ovewrite existing value, otherwise throw error when key exists
   */
  save(key: string, value: any, overwrite: boolean = true) {
    if (!overwrite && this.get(key)) {
      throw new Error(`cannot overwite existing value for key [${key}]`)
    }
    const json = value === null ? undefined : JSON.stringify(value)
    this.target.setItem(key, json)
  }
}

export const local = new StorageWrapper(localStorage)
export const session = new StorageWrapper(sessionStorage)
