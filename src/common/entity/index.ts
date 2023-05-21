import { Dexie } from 'dexie'
import { RegionDao } from './region/RegionDao.js'
import { JourneyDao } from './journey/JoureyDao.js'
import { JourneyThemeDao } from './journey/JourneyThemeDao.js'
import { AppConfigDao } from './appconfig/AppConfigDao.js'
export class AmbuloDb extends Dexie {
  constructor(databaseName: string) {
    super(databaseName)
  }
}
const db = new AmbuloDb('ambulo')
// const regionDao = new RegionDao(db)

const regionDao = new RegionDao(db)
const journeyDao = new JourneyDao(db)
const journeyThemeDao = new JourneyThemeDao(db)
const appConfigDao = new AppConfigDao(db)
export { db, regionDao, journeyDao, journeyThemeDao, appConfigDao }
export default {}
