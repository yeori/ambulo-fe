/**
 * sido(광역시, 도)
 */
export interface Sido {
  seq: number
  regionName: string
  regionCode: string
}

export default class Region implements Sido {
  seq: number
  regionName: string
  regionCode: string
  constructor(target: Sido) {
    this.seq = target.seq
    this.regionName = target.regionName
    this.regionCode = target.regionCode
  }
  static wrap(data: Sido): Region {
    return new Region(data)
  }
}
