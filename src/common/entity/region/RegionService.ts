import { regionDao } from '../index.js'

export class RegionService {
  initRegions(regions) {
    return regionDao.initRegion(regions)
    // return api.region.load().then((res) => {
    //   const { regions } = res

    // })
  }

  findRegions() {
    return regionDao.findRegions()
  }
}

export default new RegionService()
