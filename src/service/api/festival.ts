import { Festival, type IFestival } from '@/common/entity/festival/Festival.js'
import { GET } from './request.js'

const PREFIX = '/api/festivals'

const wrapFestival = (res) => {
  res.festivals = res.festivals.map((fv) => new Festival(fv))
  return res
}
export default {
  bySido: (sidoCode) =>
    GET(`${PREFIX}/sido/${sidoCode}`).then((res) => {
      res.festivals = res.festivals.map((fv: IFestival) => new Festival(fv))
      return res
    }),
  countBySido: () => GET(`${PREFIX}/stats/sido`),
  getActive: () => GET(`${PREFIX}/active`).then((res) => wrapFestival(res))
}
