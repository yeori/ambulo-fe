export class Page {
  readonly totalItems: number
  readonly start: number
  readonly size: number
  readonly end: number
  constructor(data: Page) {
    Object.keys(data).forEach((prop) => {
      this[prop] = data[prop]
    })
  }
  hasMoreSearch() {
    return this.end < this.totalItems
  }
}
const typeMap = {
  12: 'SPOT',
  14: 'CULTURE',
  15: 'FESTIVAL',
  25: 'JRN'
}
const regexHeading = /###.*[\n\r]/g
const regexLi = /[\n] \*/g
const journeyOverview = (content: string) =>
  content.replaceAll(regexLi, '').replaceAll(regexHeading, '')

export class SearchItem {
  cate: 'PLC' | 'JRN'
  typeCode: number
  title: string
  uuid: string
  content: string
  constructor(data: SearchItem) {
    Object.keys(data).forEach((prop) => {
      this[prop] = data[prop]
    })
  }
  get itemId() {
    return `${this.cate}:${this.uuid}`
  }
  getOverview(limit = 300) {
    const { cate } = this
    let overview: string =
      cate === 'PLC'
        ? JSON.parse(this.content).overview
        : cate === 'JRN'
        ? journeyOverview(this.content)
        : this.content
    if (overview.length > limit) {
      return overview.substring(0, limit) + '...'
    } else {
      return overview
    }
  }
  get type() {
    return typeMap[this.typeCode] || 'ETC'
  }
}
let idGen = 1000
export class SearchResult {
  id: number
  page: Page
  items: SearchItem[]
  constructor(data: SearchResult) {
    this.id = idGen++
    Object.keys(data).forEach((prop) => {
      this[prop] = data[prop]
      if (prop === 'items') {
        this[prop] = this[prop].map((item) => new SearchItem(item))
      } else if (prop === 'page') {
        this[prop] = new Page(this[prop])
      }
    })
  }
}
