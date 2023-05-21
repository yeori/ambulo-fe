import type { AmbuloDb } from '@/common/entity/index.js'
import { db } from '@/common/entity/index.js'

export class AppConfigDao {
  tableName: string = 'configs'
  constructor(readonly db: AmbuloDb) {
    db.version(1).stores({
      [this.tableName]: '++seq'
    })
  }
  get table() {
    return this.db[this.tableName]
  }
  isFirstOpen(): Promise<boolean> {
    return this.table.get(1).then((config: any) => {
      return !config
    })
  }
  setInit() {
    this.table.add({ initTime: new Date() })
  }
}
