import type { AmbuloDb } from '@/common/entity/index.js'
import type { JourneyTheme } from './JourneyTheme.js'
import type { Table } from 'dexie'

export class JourneyThemeDao {
  tableName: string = 'journey_themes'
  constructor(readonly db: AmbuloDb) {
    db.version(1).stores({
      [this.tableName]: '++pk,seq'
    })
  }
  get table() {
    return this.db[this.tableName] as Table<JourneyTheme>
  }
  initThemes(journeyThemes: JourneyTheme[]) {
    return this.table.bulkPut(journeyThemes)
  }
  findThemes(): Promise<JourneyTheme[]> {
    return this.table.toArray()
  }
}
