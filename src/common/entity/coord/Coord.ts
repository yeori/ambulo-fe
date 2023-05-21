export type CoordType = {
  lat: number
  lng: number
  alt: number
  orderNum: number
  segmentRef?: number

  sidoRef?: number
  fullAddress?: string
}
export class Coord {
  lat: any
  lng: any
  alt: any

  orderNum: number
  segmentRef?: number

  sidoRef?: number
  fullAddress?: string
  constructor({ lat, lng, alt, sidoRef, fullAddress }: CoordType) {
    this.lat = lat
    this.lng = lng
    this.alt = alt
    this.sidoRef = sidoRef
    this.fullAddress = fullAddress
  }
}
