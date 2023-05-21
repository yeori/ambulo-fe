import util from '@/service/util/index.js'
import { Coord, type CoordType } from '../coord/Coord.js'
import type { Journey } from '../journey/Journey.js'
import type { SegmentType } from '../segment/Segment.js'

export type CourseType = {
  journeySeq: number
  segmentSeq: number
  order: number
  startOrder: number
  startPos?: CoordType
  endOrder: number
  endPos?: CoordType
  coords: Array<CoordType>

  journey?: Journey
  segment?: SegmentType
}

export class Course {
  journeySeq: number
  segmentSeq: number
  order: number
  startOrder: number
  startPos?: Coord
  endOrder: number
  endPos?: Coord
  coords: Array<Coord>

  journey?: Journey
  segment?: SegmentType
  constructor(data: CourseType) {
    Object.keys(data)
      .filter(util.type.isPrimitive)
      .forEach((prop) => {
        this[prop] = data[prop]
      })
    this.coords = data.coords.map((coord) => new Coord(coord))
    this.startPos = data.startPos ? new Coord(data.startPos) : undefined
    this.endPos = data.endPos ? new Coord(data.endPos) : undefined
  }
}
