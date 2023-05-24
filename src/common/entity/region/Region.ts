import type { Journey } from '../journey/Journey.js'

/**
 * sido(광역시, 도)
 */
export interface Sido {
  seq: number
  regionName: string
  regionShortName: string
  regionCode: string
}

export class Region implements Sido {
  seq: number
  regionName: string
  regionShortName: string
  regionCode: string
  journeys: Journey[] = []
  constructor(target: Sido) {
    this.seq = target.seq
    this.regionName = target.regionName
    this.regionShortName = target.regionShortName
    this.regionCode = target.regionCode
  }
  get shortName() {
    return this.regionShortName
  }
  get fullName() {
    return this.regionName
  }
  /**
   * 시도별 로고 url
   * @returns logo url
   */
  getLogoUrl() {
    const code = this.regionCode
    const ext = code === 'sejong' ? 'jpg' : code === 'gwangju' ? 'png' : 'svg'
    // [root]/public/images 아래에 넣어뒀음
    return `/images/logo/logo-${code}.${ext}`
  }
  isEmpty(): boolean {
    return this.journeys.length === 0
  }

  equals(other: Region): boolean {
    return this.seq === other.seq
  }

  static wrap(data: Sido): Region {
    return new Region(data)
  }
}
