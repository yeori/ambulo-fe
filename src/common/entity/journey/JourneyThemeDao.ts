import type { AmbuloDb } from '@/common/entity/index.js'
import { JourneyTheme } from './JourneyTheme.js'
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
    return this.table.toArray().then(JourneyTheme.selectWrap)
  }
  findTheme(column: string, value: any) {
    return this.table
      .where(column)
      .equals(value)
      .toArray(JourneyTheme.selectWrap)
  }
}
