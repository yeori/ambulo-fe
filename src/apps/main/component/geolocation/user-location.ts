import { writable, type Subscriber, type Writable } from 'svelte/store'
import { GeoLocation } from './GeoLocation.js'
// import { PeriodicTimer } from '@/service/util/timer.js'

type LocState = {
  permissionState: 'granted' | 'prompt' | 'denied'
  scanning: boolean
  pos: GeolocationPosition
}
class LocationStore {
  private state: Writable<LocState>
  constructor() {
    this.state = writable({
      permissionState: undefined,
      scanning: false,
      pos: undefined
    } as LocState)
  }
  update(fn: { (state: LocState): void }) {
    this.state.update((state) => {
      fn(state)
      return state
    })
  }
  subscribe(fn: Subscriber<LocState>) {
    return this.state.subscribe(fn)
  }
  setScanning(scanning: boolean) {
    this.update((state: LocState) => {
      state.scanning = scanning
    })
  }
  updatePosition(pos: GeolocationPosition) {
    this.update((state: LocState) => {
      state.pos = pos
    })
  }
  // setPermissionState(res: GeolocationPosition) {
  //   res.
  // }
}
export const locationStore = new LocationStore()

const highAccuracyOption: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0, // 이 값이 0이면 매번 최신 위치값을 가져온다고 함
  timeout: 10 * 1000
}
const geo = new GeoLocation(highAccuracyOption)

const stop = () => {
  geo.clearWatch()
  locationStore.setScanning(false)
}
const resume = () => {
  locationStore.setScanning(true)
  geo.watchPosition(
    (pos) => {
      locationStore.updatePosition(pos)
      const {
        latitude: lat,
        longitude: lng,
        heading,
        speed,
        accuracy
      } = pos.coords
      console.log(
        `id: 2311, acc: ${accuracy}, lat: ${lat}, lng: ${lng}, spd: ${speed}, dir: ${heading}`
      )
    },
    (err) => {
      locationStore.setScanning(false)
    }
  )
}
const checkGeoPermission = () => geo.queryPermission().then((state) => state)
const requestPermission = () => geo.requestPermission()

export default {
  geo,
  stop,
  resume,
  checkGeoPermission,
  requestPermission
  // clearTimer
}
