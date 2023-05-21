import { Course, type CourseType } from '../course/Course.js'
import type { RouteProvider } from './RouteConst.js'

// const enum Provider {
//   D,
//   U
// }
export type JourneyType = {
  courseIndex: string
  courses: CourseType[]
  creationTime: number
  description: string
  name: string
  officialDifficulty: number
  officialDistance: number
  officialElapsedTimes: number
  ownerRef: number
  seq: number
  themeRef: number
  provider: RouteProvider
}
export class Journey {
  courseIndex: string
  courses: Course[]
  creationTime: number
  description: string
  name: string
  officialDifficulty: number
  officialDistance: number
  officialElapsedTimes: number
  ownerRef: number
  seq: number
  themeRef: number
  provider: RouteProvider
  /**
   * 여정을 구성하는 course들의 시작점과 끝점이 속한 시도의 seq들을 저장
   */
  regionRef: number[]
  constructor(data: JourneyType) {
    Object.keys(data).forEach((prop) => {
      if (prop === 'courses') {
        this.courses = data.courses.map((course) => new Course(course))
        this.regionRef = retrieveRegionSeq(this.courses)
      } else {
        this[prop] = data[prop]
      }
    })
  }
  eachCourse(callback: (course: CourseType) => void) {
    this.courses.forEach(callback)
  }
}
const retrieveRegionSeq = (courses: Course[]): number[] => {
  const refs = new Set<number>()
  courses.reduce((refs, course) => {
    refs.add(course.startPos!.sidoRef)
    refs.add(course.endPos!.sidoRef)
    return refs
  }, refs)
  return [...refs.values()]
}
