export interface IPlaceDetail {
  overview: string
  site: string
  addr1: string
  addr2: string
  zipcode: string
  getAddress(): string
  getOverview(): string[]
}

export class PlaceDetail implements IPlaceDetail {
  overview: string
  site: string
  addr1: string
  addr2: string
  zipcode: string
  constructor(data: IPlaceDetail) {
    Object.keys(data).forEach((prop) => {
      this[prop] = data[prop]
    })
  }
  getAddress(): string {
    const { addr1, addr2, zipcode } = this
    return `${addr1} ${addr2} (우)${zipcode}`
  }
  getOverview(): string[] {
    const paras = this.overview
      .split('<br>')
      .flatMap((para) => para.split('<br />'))
    return paras.flatMap((p) => p.split('\n'))
  }
}
