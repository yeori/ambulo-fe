import type { CoordType } from '../coord/Coord.js'

export type SegmentType = {
  seq: number
  type: string
  circular: boolean
  ownerRef: number
  fingerprint: string
  positions: Array<CoordType>
}
