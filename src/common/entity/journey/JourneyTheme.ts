import type { Journey } from './Journey.js'
import type { RouteProvider } from './RouteConst.js'

export interface IJourneyTheme {
  pk: number
  seq: number
  routeName: string
  routeType: string
  routeIndex: string
  routeDesc: string
  provider: RouteProvider
  countDistance(): number
}

export class JourneyTheme implements IJourneyTheme {
  pk: number
  seq: number
  routeName: string
  routeType: string
  routeIndex: string
  routeDesc: string
  provider: RouteProvider
  journyes: Journey[] = []
  constructor(data: IJourneyTheme) {
    Object.keys(data).forEach((prop) => {
      this[prop] = data[prop]
    })
  }
  setJourneys(journeys: Journey[]) {
    if (journeys && journeys.length > 0) {
      this.journyes = journeys
    }
  }
  countDistance(): number {
    return this.journyes.reduce((dist, jr) => dist + jr.officialDistance, 0)
  }
  equals(other: JourneyTheme): boolean {
    return other && this.routeIndex === other.routeIndex
  }

  static wrap(data: IJourneyTheme): JourneyTheme {
    data.pk = undefined
    return new JourneyTheme(data)
  }
  static selectWrap(elems: IJourneyTheme[]): JourneyTheme[] {
    return elems.map((elem) => new JourneyTheme(elem))
  }
}
