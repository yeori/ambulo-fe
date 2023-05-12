import type { IMapPos, IMapSpec } from '../IMapSpec.js'
import { KakaoPath } from './KakaoPath.js'

export class KakaoPos implements IMapPos {
  constructor(private readonly geoPos: GeolocationPosition) {}
  get lat() {
    return this.geoPos.coords.latitude
  }
  get lng() {
    return this.geoPos.coords.longitude
  }
  get alt() {
    return undefined
  }
  toLatLng() {
    return new window.kakao.maps.LatLng(this.lat, this.lng)
  }
}

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
  render(pos: IMapPos, zoomLevel) {
    this.pos = pos
    this.zoom = zoomLevel
    this.mapHandle = new window.kakao.maps.Map(this.el, {
      center: pos.toLatLng(),
      level: this.zoom
    })
    return this
  }

  createPath() {
    const uuid = Math.random().toString(36).substring(2)
    const path = new KakaoPath(uuid, this.mapHandle)
    this.pathes.push(path)
    return path
  }
}
