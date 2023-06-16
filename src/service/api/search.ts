import { SearchResult } from '@/common/entity/search/SearchResult.js'
import { GET } from './request.js'
import { Place } from '@/common/entity/place/Place.js'
import { PlaceDetail } from '@/common/entity/place/place-detail.js'

export default {
  byKeyword: (keyword: string, next: number, size: number) =>
    GET('/api/search', { q: keyword, next, size }).then((res) => {
      res.result = new SearchResult(res.result)
      return res
    }),
  detail: (cate: string, uuid: string) =>
    GET('/api/search/detail', { cate, uuid }).then((res) => {
      const { cate } = res
      if (cate === 'PLC') {
        const place = new Place(res.entity)
        place.detail = new PlaceDetail(place.detail)
        res.entity = place
      }
      return res
    })
}
