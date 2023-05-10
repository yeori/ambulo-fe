import { writable, type Subscriber, type Writable } from 'svelte/store'
import { GeoLocation } from './GeoLocation.js'
import { PeriodicTimer } from '@/service/util/timer.js'

type LocState = {
  scanning: boolean
}
class LocationStore {
  private state: Writable<LocState>
  constructor() {
    this.state = writable({
      scanning: false
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
}
export const locationStore = new LocationStore()

const geo = new GeoLocation()

const timer = new PeriodicTimer(
  () => {
    let s = Date.now()
    geo.scan().then((pos) => {
      const { latitude: lat, longitude: lng, heading, speed } = pos.coords
      console.log(
        `id: 2311, time: ${
          Date.now() - s
        }, lat: ${lat}, lng: ${lng}, spd: ${speed}, dir: ${heading}`
      )
    })
  },
  5000,
  false
)

const stop = () => {
  timer.pause()
  locationStore.setScanning(false)
}
const resume = () => {
  timer.resume()
  locationStore.setScanning(true)
}
const clearTimer = () => timer.dispose()

// export {geo}
export default {
  geo,
  stop,
  resume,
  clearTimer
}
