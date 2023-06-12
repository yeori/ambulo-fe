import { Place } from '../place/Place.js'

export interface IFestival {
  seq: number
  startDate: string
  endDate: string
  place: Place
}

export interface Duration {
  isSameYear(): boolean
  isOneDay(): boolean
  start: string
  end: string
  compare(ymd: string): number
  getStatus(ymd: string): string
}
export class Festival implements IFestival, Duration {
  seq: number
  startDate: string
  endDate: string
  place: Place
  constructor(data: IFestival) {
    Object.keys(data).forEach((prop) => {
      if (prop === 'place') {
        this[prop] = new Place(data[prop])
      } else {
        this[prop] = data[prop]
      }
    })
  }
  isSameYear(): boolean {
    const { startDate, endDate } = this
    return startDate.substring(0, 4) === endDate.substring(0, 4)
  }
  isOneDay(): boolean {
    const { startDate, endDate } = this
    return startDate === endDate
  }
  get start() {
    return this.startDate
  }
  get end() {
    return this.endDate
  }
  get uuid() {
    return this.place.uuid
  }
  getDuration() {
    return { start: this.startDate, end: this.endDate }
  }
  compare(ymd: string): number {
    if (ymd < this.startDate) {
      // 시작 전
      return 0
    } else if (ymd > this.endDate) {
      // 끝남
      return +1
    } else {
      // 진행중
      return -1
    }
  }
  getStatus(ymd: string): string {
    const cmp = this.compare(ymd)
    return cmp === -1 ? '진행중' : cmp === 0 ? '시작전' : '종료'
  }
}
