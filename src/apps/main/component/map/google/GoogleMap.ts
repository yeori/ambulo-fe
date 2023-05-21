import type { Journey } from '@/common/entity/journey/Journey.js'
import type { IMapPath, IMapPos, IMapSpec, PathPoint } from '../IMapSpec.js'
import { type JourneyPathOption, JourneyPath } from '../JourneyPath.js'
import GooglePath from './GooglePath.js'
import { GooglePos } from './GooglePos.js'

const calcuateDistance = (points: IMapPos[]) => {
  // const distLine = new google.maps.Polyline({ path: [] })
  let ref = points[0] as PathPoint
  ref.order = 0
  ref.distance = 0

  for (let k = 1; k < points.length; k++) {
    const pos = points[k] as PathPoint
    pos.order = k
    // distLine.setPath([ref.toLatLng(), pos.toLatLng()])
    const dist = google.maps.geometry.spherical.computeLength([
      ref.toLatLng(),
      pos.toLatLng()
    ])
    pos.distance = ref.distance + dist
    ref = pos
  }
}

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
  render(initialCenter: IMapPos, zoomLevel: number): IMapSpec {
    this.pos = initialCenter
    this.zoom = zoomLevel
    this.mapHandle = new google.maps.Map(this.el, {
      center: this.pos.toLatLng(),
      zoom: this.zoom
    })
    return this
  }

  createPosition(coord: { lat: number; lng: number }): IMapPos {
    return new GooglePos(coord)
  }
  createPath(points: IMapPos[] = []): IMapPath {
    const uuid = Math.random().toString(36).substring(2)
    calcuateDistance(points)
    const path = new GooglePath(uuid, this.mapHandle, points as PathPoint[])
    this.pathes.push(path)
    return path
  }
  createJourneyPath(journey: Journey, option?: JourneyPathOption): JourneyPath {
    return new JourneyPath(this, journey)
  }
}
