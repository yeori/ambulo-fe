export type PositionData = GeolocationCoordinates & {
  timeDelta: number
}

export class AmbuloSession {
  readonly startTime: number
  readonly positions: PositionData[] = []
  constructor() {
    this.startTime = Date.now()
  }
  mark(coord: GeolocationCoordinates) {
    const {
      accuracy,
      altitude,
      altitudeAccuracy,
      heading,
      latitude,
      longitude,
      speed
    } = coord
    this.positions.push({
      timeDelta: Date.now() - this.startTime,
      accuracy,
      altitude,
      altitudeAccuracy,
      heading,
      latitude,
      longitude,
      speed
    })
    console.log('[# of moves]', this.positions)
  }
  close() {
    this.positions.splice(0, this.positions.length)
    console.log('[sessoin l/')
  }
}
