import type { IMapBound, IMapSpec } from '@/apps/main/component/map/IMapSpec.js'
import type { Festival } from './Festival.js'
import { get, writable, type Writable } from 'svelte/store'
import { REGION_CODE } from '@/common/entity/region/Region.js'
import { Pagination } from '@/service/pagination/Pagination.js'
import util from '@/service/util/index.js'
import api from '@/service/api/index.js'
const update = util.svelteStore.helpUpdate

const sidoMap = {
  서울특별시: REGION_CODE.SEOUL,
  인천광역시: REGION_CODE.INCHEON,
  강원도: REGION_CODE.GWD,
  경기도: REGION_CODE.GGD,
  경상남도: REGION_CODE.GSND,
  경상북도: REGION_CODE.GSBD,
  광주광역시: REGION_CODE.GWANGJU,
  대구광역시: REGION_CODE.DAEGU,
  대전광역시: REGION_CODE.DAEJEON,
  부산광역시: REGION_CODE.BUSAN,
  울산광역시: REGION_CODE.ULSAN,
  전라남도: REGION_CODE.JLND,
  전라북도: REGION_CODE.JLBK,
  제주특별자치도: REGION_CODE.JEJU,
  세종특별자치시: REGION_CODE.SEJONG,
  충청남도: REGION_CODE.CCND,
  충청북도: REGION_CODE.CCBD
}

type FestivalList = {
  festivals: Festival[]
  mapArea: IMapBound
  visibles: Festival[]
  region: REGION_CODE
  pgn: Pagination<Festival>
}
type FestivalCount = {
  sido: keyof REGION_CODE
  cnt: number
}
const updateVisible = (
  store: Writable<FestivalList>,
  area: IMapBound,
  driver: IMapSpec
) => {
  // const { place } = festival
  const filter = area
    ? (festival: Festival) => {
        const pos = driver.createPosition(festival.place.spot.positions[0])
        return area.contains(pos.toLatLng())
      }
    : () => true
  update(store, (store) => {
    store.mapArea = area
    store.visibles = store.festivals.filter(filter)
  })
}

export class FestivalStore {
  find(predicate: (fv: Festival) => boolean): Festival {
    const { festivals } = get(this.store)
    return festivals.find(predicate)
  }
  driver: IMapSpec
  private store: Writable<FestivalList>
  constructor() {
    this.store = writable({
      region: undefined,
      mapArea: undefined,
      festivals: [],
      visibles: [],
      pgn: undefined
    })
  }
  subscribe(callback) {
    return this.store.subscribe(callback)
  }
  setDriver(driver: IMapSpec) {
    this.driver = driver
  }
  preparePagination() {
    const festivals = get(this.store).visibles
    return new Pagination(festivals, { numOfRows: 10, pageIndex: 0 })
  }
  /**
   * 광역시도별 activel festivals 갯수(activel festival: 현재 시간에 참여 가능한 행사)
   * @returns
   */
  loadSidoStats() {
    return api.festival.countBySido().then((res) => {
      const { stat } = res
      Object.values(sidoMap).forEach((sidoCode) => {
        if (stat[sidoCode] === undefined) {
          stat[sidoCode] = 0
        }
      })
      return stat
    })
  }
  loadFestivals(sidoName: string, mapArea?: IMapBound) {
    const region: REGION_CODE = sidoMap[sidoName]
    const store = get(this.store)
    if (store.region === region) {
      updateVisible(this.store, mapArea, this.driver)
      return Promise.resolve()
    }
    return api.festival.bySido(region).then((res) => {
      const festivals: Festival[] = res.festivals
      const now = util.time.ymd(new Date())
      festivals.sort((a, b) => {
        const cmpA = a.compare(now)
        const cmpB = b.compare(now)
        return cmpA - cmpB
      })
      update(this.store, (store) => {
        store.mapArea = mapArea
        store.region = region
        store.festivals = festivals
        store.visibles = festivals
      })
      return res
    })
  }
  loadActiveFestivals(time: Date = new Date()): Promise<Festival[]> {
    return api.festival.getActive().then((res) => {
      console.log(res)
      return res.festivals
    })
  }
}

export const festivalStore = new FestivalStore()
