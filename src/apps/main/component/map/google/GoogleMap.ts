import type { IMapPath, IMapPos, IMapSpec } from '../IMapSpec.js'
import GooglePath from './GooglePath.js'

export default class GoogleMap implements IMapSpec {
  pos: IMapPos
  apiKey: string
  zoom: number
  mapHandle: google.maps.Map
  pathes: GooglePath[] = []
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
  createPath(): IMapPath {
    const uuid = Math.random().toString(36).substring(2)
    const path = new GooglePath(uuid, this.mapHandle)
    this.pathes.push(path)
    return path
  }
  render(initialCenter: IMapPos, zoomLevel: number): IMapSpec {
    this.pos = initialCenter
    this.zoom = zoomLevel
    this.mapHandle = new google.maps.Map(this.el, {
      center: this.pos.toLatLng(),
      zoom: this.zoom
    })
    return this
  }
}
