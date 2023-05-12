import type { IMapPos, IMapSpec } from '../IMapSpec.js'
import { KakaoPath } from './KakaoPath.js'

export class KakaoMap implements IMapSpec {
  pos: IMapPos
  apiKey: string
  zoom: number
  mapHandle: any
  pathes: KakaoPath[] = []
  constructor(
    readonly el: HTMLElement,
    apiKey: string,
    zoom = 5,
    pos?: IMapPos
  ) {
    this.pos = pos
    this.apiKey = apiKey
    this.zoom = zoom
    this.pos = pos
    this.mapHandle = undefined
  }
  render(pos: IMapPos, zoomLevel: number) {
    this.pos = pos
    this.zoom = zoomLevel
    this.mapHandle = new kakao.maps.Map(this.el, {
      center: pos.toLatLng(),
      level: this.zoom
    } as kakao.maps.KakoMapOption)
    return this
  }

  createPath() {
    const uuid = Math.random().toString(36).substring(2)
    const path = new KakaoPath(uuid, this.mapHandle)
    this.pathes.push(path)
    return path
  }
}
