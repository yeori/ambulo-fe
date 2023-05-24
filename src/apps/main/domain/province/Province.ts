import type { Region } from '@/common/entity/region/Region.js'
import i18n from '@/common/i18n/index.js'

const toPathForm = (path: string): PathForm => {
  const p = path.indexOf(' ')
  const [x, y] = path
    .substring(0, p)
    .trim()
    .split(',')
    .map((str) => Number.parseFloat(str))
  const value = path.substring(p).trim()
  return { x, y, value }
}

export type PathForm = {
  x: number
  y: number
  value: string
}
export type ProvinceType = {
  id: string
  name: string
  pathes: string[]
}

export type ProvinceTheme = {
  bgc: string
  fgc: string
}

export class Province {
  readonly id: string
  readonly _name: string
  leadingPos: string
  pathes: Array<PathForm>
  region: Region
  theme: ProvinceTheme
  active: boolean = false
  constructor({ id, name, pathes }: ProvinceType, theme: ProvinceTheme) {
    this.id = id
    this._name = name
    this.pathes = pathes.map((path) => toPathForm(path))
    this.region = undefined
    this.theme = theme
    this.active = false
  }
  get name() {
    return i18n.parse(`@province.${this._name}`)
  }
  get shortName() {
    return this.region.shortName
  }
  getLogoUrl() {
    return this.region.getLogoUrl()
  }
  toPathText() {
    return this.pathes
      .map((path) => `m ${path.x},${path.y} ${path.value} z`)
      .join(' ')
  }
  getOffetPath() {
    return this.pathes
      .map((path) => `m ${path.x},${path.y} ${path.value} z`)
      .join(' ')
  }
}
