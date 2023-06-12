import { get, writable, type Subscriber, type Writable } from 'svelte/store'
import util from '../util/index.js'
const update = util.svelteStore.helpUpdate

export type PageOption<T> = {
  pageIndex?: number
  numOfRows?: number
}
// type DefaultPgnOption<T> = Omit<PageOption<T>, 'elements'>

const DEFAULT_PGN_OPTION: PageOption<any> = {
  pageIndex: 0,
  numOfRows: 10
}

export class Pgn<T> {
  constructor(
    private readonly ctx: Pagination<T>,
    readonly startIndex: number,
    readonly endIndex: number
  ) {}
  getItems() {
    return this.ctx.elements.slice(this.startIndex, this.endIndex)
  }
  hasPrev(): boolean {
    return this.startIndex > 0
  }
  hasNext(): boolean {
    console.log('next: ', this.endIndex, this.ctx.elements.length)
    return this.endIndex < this.ctx.elements.length
  }
  next(cnt = 10) {
    return this.ctx.nextPage(this, cnt)
  }
}

export class Pagination<T> {
  store: Writable<{ pgn: Pgn<T>; items: T[] }>
  // pgn: Pgn<T>
  private option: PageOption<T>
  elements: T[]
  constructor(elements: T[], option: PageOption<T>) {
    this.option = option
    Object.assign(option, DEFAULT_PGN_OPTION)
    this.store = writable({ pgn: undefined, items: [] })
    this.reset(elements)
  }
  reset(elements: T[]) {
    this.elements = elements
    const pgn = this.getPage(0)
    update(this.store, (store) => {
      store.pgn = pgn
      store.items = pgn.getItems()
    })
  }
  subscribe(callback: Subscriber<{ items: T[]; pgn: Pgn<T> }>) {
    return this.store.subscribe(callback)
  }
  getPage(pageIndex: number = 0): Pgn<T> {
    const { numOfRows } = this.option
    const start = pageIndex * numOfRows
    const end = Math.min(start + numOfRows, this.elements.length)
    const pgn = new Pgn(this, start, end)
    return pgn
  }
  nextPage(pgn: Pgn<T>, cnt: number) {
    const { numOfRows } = this.option
    cnt = cnt || numOfRows
    const startIndex = pgn.endIndex
    const endIndex = Math.min(startIndex + cnt, this.elements.length)
    const nextPgn = new Pgn(this, startIndex, endIndex)
    return nextPgn
  }
  loadMore(cnt) {
    let { pgn } = get(this.store)
    pgn = this.nextPage(pgn, cnt)
    update(this.store, (store) => {
      store.items.push(...pgn.getItems())
      store.pgn = pgn
    })
  }
  hasNext() {
    return get(this.store).pgn.hasNext()
  }
}
