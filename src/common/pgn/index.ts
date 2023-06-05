export type PageOption<T> = {
  elements: T[]
  pageIndex?: number
  numOfRows?: number
}
type DefaultPgnOption<T> = Omit<PageOption<T>, 'elements'>

const DEFAULT_PGN_OPTION: DefaultPgnOption<any> = {
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
    return this.endIndex < this.ctx.elements.length
  }
  next() {
    return this.ctx.nextPage(this)
  }
}
export class Pagination<T> {
  // offset: number
  constructor(private readonly option: PageOption<T>) {
    Object.assign(this.option, DEFAULT_PGN_OPTION)
    this.option.elements = [...this.option.elements]
  }
  get elements() {
    return this.option.elements
  }
  getPage(pageIndex: number = 0): Pgn<T> {
    const { numOfRows, elements } = this.option
    const start = pageIndex * numOfRows
    const end = Math.min(start + numOfRows, elements.length)
    return new Pgn(this, start, end)
  }
  nextPage(pgn: Pgn<T>) {
    const { numOfRows, elements } = this.option
    const startIndex = pgn.startIndex + numOfRows
    const endIndex = Math.min(startIndex + numOfRows, elements.length)
    return new Pgn(this, startIndex, endIndex)
  }
}
