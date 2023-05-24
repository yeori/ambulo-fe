import { Course, type CourseType } from '../course/Course.js'
import { RouteProvider } from './RouteConst.js'

// const enum Provider {
//   D,
//   U
// }

const enum DIFFICULTY {
  EASY = 'easy',
  MEDUIM = 'medium',
  HARD = 'hard',
  EXTREME = 'extreme'
}
const DiffMap = [
  DIFFICULTY.EASY,
  DIFFICULTY.MEDUIM,
  DIFFICULTY.HARD,
  DIFFICULTY.EXTREME
]

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
  pk: number
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
  getDifficultyText(): DIFFICULTY {
    return DiffMap[this.officialDifficulty - 1]
  }
  getMinifiedName() {
    if (this.provider === RouteProvider.D) {
      // XXXX길 NN코스
      // XXXX길 지선NN코스
      // XXXX길 NN코스 주석이름
      // XXXX길 NN코스(주의사항) : 해파랑길 50코스
      const { name } = this

      // 'XXX'  'NN코스...'
      const [left, right] = name.split('길 ').map((t) => t.trim())

      // ('NN'|'지선NN') , etc
      const [courseNUm, etc] = right.split('코스').map((t) => t.trim())
      return courseNUm + '코스'
    } else {
      return this.name
    }
  }
  getStartPos() {
    return this.courses[0].startPos
  }
  equals(other: Journey) {
    return this.courseIndex === other.courseIndex
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
