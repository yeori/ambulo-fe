import type { REGION_CODE } from '@/common/entity/region/Region.js'
import { GET } from './request.js'
import { Place } from '@/common/entity/place/Place.js'

export default {
  byRegion: (regionCode: REGION_CODE) =>
    GET('/api/spot/places', { regionCode }).then((res) => {
      res.places = res.places.map((place) => new Place(place))
      return res
    }),
  festivals: (regionCode: REGION_CODE, startDate: string) =>
    GET('/api/spot/festivals', { regionCode, startDate }),
  detail: (placeUuid: string) => GET(`/api/spot/${placeUuid}/detail`),
  photo: (placeUuid: string) => GET(`/api/spot/${placeUuid}/photo`)
}
