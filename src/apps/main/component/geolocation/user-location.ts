import { writable, type Subscriber, type Writable } from 'svelte/store'
import { GeoLocation } from './GeoLocation.js'
// import { PeriodicTimer } from '@/service/util/timer.js'

type LocState = {
  scanning: boolean
  pos: GeolocationPosition
}
class LocationStore {
  private state: Writable<LocState>
  constructor() {
    this.state = writable({
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
}
export const locationStore = new LocationStore()

const geo = new GeoLocation()

// const timer = new PeriodicTimer(
//   () => {
//     let s = Date.now()
//     geo.scan().then((pos) => {
//       const { latitude: lat, longitude: lng, heading, speed } = pos.coords
//       console.log(
//         `id: 2311, time: ${
//           Date.now() - s
//         }, lat: ${lat}, lng: ${lng}, spd: ${speed}, dir: ${heading}`
//       )
//     })
//   },
//   5000,
//   false
// )

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
// const clearTimer = () => timer.dispose()

// export {geo}
export default {
  geo,
  stop,
  resume
  // clearTimer
}
