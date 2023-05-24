import type { Journey } from '@/common/entity/journey/Journey.js'
import type {
  IMapPath,
  IMapPos,
  IMapSpec,
  OverayOption,
  PathPoint
} from '../IMapSpec.js'
import { KakaoPath } from './KakaoPath.js'
import { KakaoPos } from './KakaoPos.js'
import { JourneyPath } from '../JourneyPath.js'
import type { Writable } from 'svelte/store'

const calcuateDistance = (points: IMapPos[]) => {
  const distLine = new kakao.maps.Polyline({ path: [] })
  let prev = points[0] as PathPoint
  prev.order = 0
  prev.distance = 0
  prev.milestone = true
  let milestone = 1000 // m
  for (let k = 1; k < points.length; k++) {
    const cur = points[k] as PathPoint
    cur.order = k
    distLine.setPath([prev.toLatLng(), cur.toLatLng()])
    cur.distance = prev.distance + distLine.getLength()
    if (prev.distance <= milestone && milestone <= cur.distance) {
      const mid = (prev.distance + cur.distance) / 2
      const target = mid >= milestone ? prev : cur
      target.milestone = true
      milestone += 1000
    }
    prev = cur
  }
  ;(points[points.length - 1] as PathPoint).milestone = true
}

type IShape = {
  type: 'overlay' | 'path'
  value: any
}
export class KakaoMap implements IMapSpec {
  pos: IMapPos
  apiKey: string
  zoom: number
  mapHandle: kakao.maps.Map
  pathes: KakaoPath[] = []
  eventCallback: (e: any, mapHandle: IMapSpec) => void
  // shapes: Writable<IShape[]>
  constructor(
    readonly el: HTMLElement,
    apiKey: string,
    zoom = 5,
    pos?: IMapPos,
    eventCallback?: (eventName: string, e?: any, mapHandle?: IMapSpec) => void
  ) {
    this.pos = pos
    this.apiKey = apiKey
    this.zoom = zoom
    this.pos = pos
    this.mapHandle = undefined
    this.eventCallback = eventCallback || ((_) => {})
  }
  on(callback: { (e: any, mapHandle: IMapSpec): void }) {
    this.eventCallback = callback
  }
  drawOverlay(option: OverayOption): any {
    const overlay = new kakao.maps.CustomOverlay({
      map: this.mapHandle,
      content: option.content,
      position: this.createPosition(option.position).toLatLng(),
      xAnchor: option.anchor.x,
      yAnchor: option.anchor.y,
      zIndex: option.zIndex,
      clickable: option.click
    })

    return overlay
  }
  render(pos: IMapPos, zoomLevel: number) {
    this.pos = pos
    this.zoom = zoomLevel
    this.mapHandle = new kakao.maps.Map(this.el, {
      center: pos.toLatLng(),
      level: this.zoom
    } as kakao.maps.KakoMapOption)

    this.mapHandle.addListener('center_changed', () => {
      const pos = this.mapHandle.getCenter()
      const e = { type: 'center', lat: pos.getLat(), lng: pos.getLng() }
      this.eventCallback(e, this)
    })
    this.mapHandle.addListener('zoom_changed', () => {
      const e = { type: 'zoom', level: this.mapHandle.getLevel() }
      this.eventCallback(e, this)
    })
    return this
  }
  createPosition(coord: { lat: number; lng: number }): IMapPos {
    return new KakaoPos(coord)
  }
  createPath(points: IMapPos[] = [], pathOption, hoverOption) {
    const uuid = Math.random().toString(36).substring(2)
    calcuateDistance(points)
    const path = new KakaoPath(uuid, this.mapHandle, points as PathPoint[])
    path.setStyle(
      pathOption as kakao.maps.PolylineOption,
      hoverOption as kakao.maps.PolylineOption
    )
    this.pathes.push(path)
    return path
  }
  createJourneyPath(journey: Journey): JourneyPath {
    const path = new JourneyPath(this, journey)
    // const journeyPath = []
    // journey.eachCourse((course) => {
    //   const path = new KakaoPath(journey.uuid, this.mapHandle, course.coords)
    //   // course.coords.forEach((c) => {
    //   //   path.addPosition(c)
    //   // })
    //   this.pathes.push(path)
    //   journeyPath.push(path)
    // })

    return path
  }
  setCenter(coord: { lat: number; lng: number }) {
    const pos = new kakao.maps.LatLng(coord.lat, coord.lng)
    this.mapHandle.panTo(pos)
  }
}
