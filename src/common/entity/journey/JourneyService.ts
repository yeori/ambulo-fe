import type { Journey } from './Journey.js'
import { journeyDao, journeyThemeDao } from '../index.js'
import type Region from '../region/Region.js'
import type { JourneyTheme } from './JourneyTheme.js'

export class JourneyService {
  /**
   *
   * @param journeyThemes '해파랑길, '사해랑길' 등
   * @returns
   */
  initThemes(journeyThemes: JourneyTheme[]) {
    return journeyThemeDao.initThemes(journeyThemes)
  }
  findThemes() {
    return journeyThemeDao.findThemes()
  }

  initJourneies(journeys: Journey[]) {
    // console.log('[journeys]', journeys)
    journeyDao.initJourney(journeys)
  }
  findJourneysByRegion(region: Region) {
    return journeyDao.findJourneys(region.seq)
  }
}

export default new JourneyService()
