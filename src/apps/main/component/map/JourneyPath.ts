import type { Journey } from '@/common/entity/journey/Journey.js'
import type { IMapPath, IMapPos, IMapSpec, PathPoint } from './IMapSpec.js'

const findClosestPoint = (positions: IMapPos[], target: IMapPos): number => {
  let closestIndex: number = -1
  let minDistance = Number.MAX_VALUE

  positions.forEach((point, idx) => {
    const distance = calculateDistance(target, point)
    if (distance < minDistance) {
      minDistance = distance
      closestIndex = idx
    }
  })
  return closestIndex
}

const calculateDistance = (pos1: IMapPos, pos2: IMapPos): number => {
  const latDiff = pos1.lat - pos2.lat
  const lonDiff = pos1.lng - pos2.lng
  return latDiff ** 2 + lonDiff ** 2
}

export class JourneyPathOption {
  pathVisible: boolean = true
  posVisible: boolean = false
  milestone: number = 1
}

const DEFAULT_OPTIOIN: JourneyPathOption = {
  pathVisible: true,
  posVisible: false,
  milestone: 1
}
export class JourneyPath {
  courses: IMapPath[]
  milestones: PathPoint[] = []
  private activeCourse: IMapPath
  constructor(
    readonly mapHandle: IMapSpec,
    readonly journey: Journey,
    readonly option: JourneyPathOption = DEFAULT_OPTIOIN
  ) {
    this.courses = []
    journey.eachCourse((course) => {
      const points = course.coords.map((coord) =>
        this.mapHandle.createPosition(coord)
      )
      const path = mapHandle.createPath(points)
      path.addListener('click', (e) => {
        this.setActiveCourse(path)
      })
      this.setActiveCourse(path)
      this.courses.push(path)
      // if (option.posVisible) {
      //   this.points.push(...points)
      // }
    })
  }
  setActiveCourse(course: IMapPath) {
    if (this.activeCourse) {
      this.activeCourse.setActive(false)
      this.activeCourse.setMileStoneVisible(false)
    }
    this.activeCourse = course
    this.milestones.forEach((ms) => {})
    course.setActive(true)
    course.setMileStoneVisible(true)
    // const points = course.getPoints()
    // const latLng = e.latLng
    // const index = findClosestPoint(points, {
    //   lat: latLng.getLat ? latLng.getLat() : latLng.lat(),
    //   lng: latLng.getLng ? latLng.getLng() : latLng.lng()
    // } as IMapPos)
    // console.log(points[index], course.getDistance())
  }
  dispose() {
    this.courses.forEach((path) => {
      path.dispose()
    })
  }
}
