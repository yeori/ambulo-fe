import type { Place } from '@/common/entity/place/Place.js'
import { REGION_CODE, Region } from '@/common/entity/region/Region.js'
import api from '@/service/api/index.js'
import util from '@/service/util/index.js'
import { get, writable, type Unsubscriber, type Writable } from 'svelte/store'
import type { IMapBound, IMapSpec } from '@main/component/map/IMapSpec.js'
// import { Pagination, Pgn } from '@/common/pgn/index.js'
import { Pagination, Pgn } from '@/service/pagination/Pagination.js'
import { regionStore } from '../region/region-store.js'

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
type PlaceList = {
  places: Place[]
  mapArea: IMapBound
  visibles: Place[]
  region: REGION_CODE
  pgn: Pagination<Place>
}
function updateVisible(
  store: Writable<PlaceList>,
  area: IMapBound,
  driver: IMapSpec
) {
  const filter = area
    ? (place: Place) => {
        const pos = driver.createPosition(place.spot.positions[0])
        return area.contains(pos.toLatLng())
      }
    : () => true
  update(store, (store) => {
    store.mapArea = area
    store.visibles = store.places.filter(filter)
  })
}

// export class PlacePagination {
//   private store: Writable<{ places: Place[] }>
//   private paging: Pagination<Place>
//   private pgn: Pgn<Place>
//   constructor(places: Place[]) {
//     this.store = writable({ places: [] })
//     this.reset(places)
//   }
//   reset(places: Place[]) {
//     this.paging = new Pagination({ elements: places })
//     this.pgn = this.paging.getPage()
//     update(this.store, (store) => {
//       store.places = this.pgn.getItems()
//     })
//   }
//   subscribe(callback: Subscriber<{ places: Place[] }>) {
//     return this.store.subscribe(callback)
//   }
//   loadMore(cnt) {
//     this.pgn = this.pgn.next(cnt)
//     update(this.store, (store) => {
//       store.places.push(...this.pgn.getItems())
//     })
//   }
//   hasNext() {
//     return this.pgn.hasNext()
//   }
// }
export class PlaceStore {
  driver: IMapSpec
  private store: Writable<PlaceList>
  constructor() {
    this.store = writable({
      region: undefined,
      mapArea: undefined,
      places: [],
      visibles: [],
      pgn: undefined
    } as PlaceList)
  }
  subscribe(callback: (store: PlaceList) => void): Unsubscriber {
    return this.store.subscribe(callback)
  }
  setDriver(driver: IMapSpec) {
    this.driver = driver
  }
  loadPlaces = (mapArea: IMapBound, sidoName: string) => {
    const region: REGION_CODE = sidoMap[sidoName]
    const store = get(this.store)
    if (store.region === region) {
      updateVisible(this.store, mapArea, this.driver)
      return Promise.resolve()
    }
    return api.place.byRegion(region).then((res) => {
      update(this.store, (store) => {
        store.mapArea = mapArea
        store.region = region
        store.places = res.places
      })
      updateVisible(this.store, mapArea, this.driver)
    })
  }
  loadPhoto(place: Place) {
    return api.place.photo(place.uuid).then((res) => res)
  }
  loadPlaceDetail(place: Place) {
    if (place.detail) {
      return Promise.resolve(place)
    }
    return api.place.detail(place.uuid).then((res) => {
      const { detail } = res
      place.detail = detail
      return place
    })
  }
  preparePagination(predicate: (place: Place) => boolean) {
    const places = get(this.store).visibles.filter(predicate)
    return new Pagination(places, { numOfRows: 10, pageIndex: 0 })
  }
  findPlace(predicate: (place: Place) => boolean) {
    const { places } = get(this.store)
    return places.find(predicate)
  }
  findRegion(place): Region {
    if (place.region) {
      return place.region
    } else {
      return regionStore.findRegion((rgn) => place.regionRef === rgn.seq)
    }
  }
}
export const placeStore = new PlaceStore()
