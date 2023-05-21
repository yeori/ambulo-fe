import api from '@/service/api/index.js'
import { writable, type Subscriber, type Writable } from 'svelte/store'
import type { Journey } from './Journey.js'

export class JourneyStore {
  store: Writable<Journey[]>
  constructor() {
    this.store = writable([])
  }
  subscribe(callback: Subscriber<Journey[]>) {
    return this.store.subscribe(callback)
  }
  loadSummaries() {
    api.journey.summaries().then((res) => {
      console.log(res)
    })
  }
}
export const journeySet = new JourneyStore()

export default {}
