import type { Journey } from '@/common/entity/journey/Journey.js'
import type { JourneyPath, JourneyPathOption } from './JourneyPath.js'
import type { Coord } from '@/common/entity/coord/Coord.js'

export interface IMapPos {
  lat: number
  lng: number
  alt: number
  /**
   * returns vendor specific position instance
   */
  toLatLng(): any
}

export interface PathPoint extends IMapPos {
  distance: number
  order: number
  milestone: boolean
}
export interface IMapPath {
  dispose(): void
  setMileStoneVisible(arg0: boolean): unknown
  getDistance(): number
  getPoints(): PathPoint[]
  addListener(eventName: string, callback: (e: any) => void): void
  addPosition(pos: IMapPos): IMapPath
  setActive(active: boolean): IMapPath
}
export type OverayOption = {
  position: { lat: number; lng: number }
  anchor: { x: number; y: number }
  content: string | HTMLElement
  zIndex: number
  click?: boolean
}
export interface IMapSpec {
  setCenter(pos: { lat: number; lng: number }): void
  drawOverlay(option: OverayOption): void
  createPosition(coord: { lat: number; lng: number }): IMapPos
  createJourneyPath(journey: Journey, option?: JourneyPathOption): JourneyPath
  createPath(points?: IMapPos[], pathOption?: any, hoverOption?: any): IMapPath
  /**
   *
   * @param pos {lat, lng} location info
   * @param zoomLevel
   */
  render(pos: IMapPos, zoomLevel: number): IMapSpec
}
