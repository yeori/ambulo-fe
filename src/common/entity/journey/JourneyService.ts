import type { Journey } from './Journey.js'
import { journeyDao, journeyThemeDao } from '../index.js'
import type { Region } from '../region/Region.js'
import type { JourneyTheme } from './JourneyTheme.js'
import { liveQuery } from 'dexie'

export class JourneyService {
  /**
   *
   * @param journeyThemes '해파랑길, '사해랑길' 등
   * @returns
   */
  initThemes(journeyThemes: JourneyTheme[]) {
    return journeyThemeDao.initThemes(journeyThemes)
  }
  findThemes(): Promise<JourneyTheme[]> {
    return journeyThemeDao.findThemes()
  }
  findTheme(column: keyof JourneyTheme, value: any) {
    return journeyThemeDao.findTheme(column, value)
  }

  initJourneies(journeys: Journey[]) {
    journeyDao.initJourney(journeys)
  }
  findJourneysByRegion(region: Region): Promise<Journey[]> {
    return journeyDao.findJourneys(region.seq)
  }
  findAllJourneys(): Promise<Journey[]> {
    return journeyDao.findAllJourneys()
  }
}

export default new JourneyService()
