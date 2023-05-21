import type { AmbuloDb } from '@/common/entity/index.js'
import type { Journey } from './Journey.js'
import type { Table } from 'dexie'

export class JourneyDao {
  tableName: string = 'journeys'
  constructor(readonly db: AmbuloDb) {
    db.version(1).stores({
      [this.tableName]: '++pk,seq,courseIndex,*regionRef'
    })
  }
  get table() {
    return this.db[this.tableName] as Table<Journey>
  }
  initJourney(journeys: Journey[]) {
    return this.table.bulkPut(journeys)
  }
  findJourneys(regionSeq: number): Promise<Journey[]> {
    return this.table.where('regionRef').equals(regionSeq).toArray()
  }
}
