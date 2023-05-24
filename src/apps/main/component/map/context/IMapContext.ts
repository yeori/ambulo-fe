import type { IMapPos } from '../IMapSpec.js'

export interface IMapContext {
  /**
   * 지도 시작 위치
   */
  getInitialPos(): { lat: number; lng: number }

  on(eventName: string, target: any)
  dispose()
}
