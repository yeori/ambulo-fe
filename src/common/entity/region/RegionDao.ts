// import { db } from '../index.js'
import type { AmbuloDb } from '@/common/entity/index.js'
import type { Table } from 'dexie'
import { Region, type Sido } from './Region.js'

export class RegionDao {
  tableName: string = 'regions'
  constructor(readonly db: AmbuloDb) {
    db.version(1).stores({
      regions: 'seq'
    })
  }
  get table() {
    return this.db[this.tableName] as Table<Region>
  }
  initRegion(regions: Region[]) {
    return this.table.bulkPut(regions)
    // this.table.get(region.seq).then((res) => {
    //   console.log(res)
    //   if (!res) {
    //     this.table.add(region)
    //   }
    // })
    // this.table.add(region)
  }
  findRegions() {
    return this.table
      .toArray()
      .then((regions) => regions.map((region) => new Region(region)))
  }
}

// export default new RegionDao(db)
