import { Dexie } from 'dexie'
import { RegionDao } from './region/RegionDao.js'
import { JourneyDao } from './journey/JoureyDao.js'
import { JourneyThemeDao } from './journey/JourneyThemeDao.js'
import { AppConfigDao } from './appconfig/AppConfigDao.js'

import journeyService from './journey/JourneyService.js'
import regionService from './region/RegionService.js'
import { writable } from 'svelte/store'
export class AmbuloDb extends Dexie {
  constructor(databaseName: string) {
    super(databaseName)
  }
}
const readyStore = writable({
  journey: false,
  theme: false,
  region: false,
  all: false
})

const updateReady = (prop, value: boolean) => {
  readyStore.update((state) => {
    state[prop] = value
    const { journey, theme, region } = state
    state.all = journey && theme && region
    return state
  })
}
const db = new AmbuloDb('ambulo')
// const regionDao = new RegionDao(db)

const regionDao = new RegionDao(db)
const journeyDao = new JourneyDao(db)
const journeyThemeDao = new JourneyThemeDao(db)
const appConfigDao = new AppConfigDao(db)

console.log('LISTEN HERE')

db.on('ready', (d) => {
  console.log('DB IS READY', d)
  journeyService.findAllJourneys().then((res) => {
    console.log(res.length)
    updateReady('journey', true)
  })
  regionService.findRegions().then(() => {
    updateReady('region', true)
  })
  journeyService.findThemes().then(() => {
    updateReady('theme', true)
  })
})
export { db, regionDao, journeyDao, journeyThemeDao, appConfigDao, readyStore }
export default {}
