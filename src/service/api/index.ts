import { Region, type Sido } from '@/common/entity/region/Region.js'
import { GET } from './request.js'
import { Journey, type JourneyType } from '@/common/entity/journey/Journey.js'
import place from './place.js'
import festival from './festival.js'

const conv = <U>(
  res: { [x: string]: U },
  key: string,
  converter: (data: any) => U
) => {
  const v: U = converter(res[key])
  res[key] = v
  return res
}

const app = {
  init: () =>
    GET('/api/initdata').then((res) => {
      conv(res, 'journeys', (elems) =>
        elems.map((jr: JourneyType) => new Journey(jr))
      )
      conv(res, 'regions', (elems) =>
        elems.map((elem: Sido) => Region.wrap(elem))
      )
      return res
    })
}
const journey = {
  get: (journeySeq: number) =>
    GET(`/api/journey/${journeySeq}`).then((res) => {
      res.journey = new Journey(res.journey)
      return res
    }),
  summaries: () => GET('/api/journeys/summary')
}

const region = {
  load: () =>
    GET('/api/regions').then((res) =>
      conv(res, 'regions', (regions) =>
        regions.map((region: Sido) => Region.wrap(region))
      )
    )
}
export { journey, region }

export default {
  app,
  journey,
  region,
  place,
  festival
}
