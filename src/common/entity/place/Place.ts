import type { UtcTimeString } from '@/common/type-def.js'
import type { Region } from '../region/Region.js'
import type { SegmentType } from '../segment/Segment.js'
import type { IPlaceDetail } from './place-detail.js'

export type ContactInfo = {
  A: string
  Z: string
  P: string
}

export interface IPlace {
  contactInfo: { A?: string; Z?: string; P?: string }
  creationTime: UtcTimeString
  fingerprint: string
  imageUrls: Array<string>
  mapLevel: string
  modifiedTime: UtcTimeString
  regionRef: number
  seq: number
  title: string
  type: string // P12, P14
  uuid: string
  spot: SegmentType
}
export class Place implements IPlace {
  contactInfo: { A?: string; Z?: string; P?: string }
  creationTime: string
  fingerprint: string
  imageUrls: string[]
  mapLevel: string
  modifiedTime: string
  regionRef: number
  seq: number
  title: string
  type: string
  uuid: string
  spot: SegmentType
  detail: IPlaceDetail
  region: Region = undefined
  constructor(place: IPlace) {
    Object.keys(place).forEach((prop) => {
      this[prop] = place[prop]
    })
  }
  getPosition(): { lat: number; lng: number } {
    const { lat, lng } = this.spot.positions[0]
    return { lat, lng }
  }
  getThumbnail() {
    const len = this.imageUrls.length
    if (len === 0) {
      return '/images/bg/bg000.jpg'
    } else {
      return this.imageUrls[len - 1]
    }
  }
  getOverview(): string[] {
    if (!this.detail) return []
    return this.detail.getOverview()
  }
}
