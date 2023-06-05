import fs from 'fs'
import csv from 'csv-parser'
import path from 'path'
import { describe, test } from 'vitest'

const sidoMap = {
  '00': '강원도',
  '01': '경기도',
  '02': '경상남도',
  '03': '경상북도',
  '04': '광주광역시',
  '05': '대구광역시',
  '06': '대전광역시',
  '07': '부산광역시',
  '08': '서울특별시',
  '09': '세종특별자치시',
  '10': '울산광역시',
  '11': '인천광역시',
  '12': '전라남도',
  '13': '전라북도',
  '14': '제주특별자치도',
  '15': '충청남도',
  '16': '충청북도'
}
Object.keys(sidoMap).forEach((prop) => {
  const value = sidoMap[prop]
  sidoMap[value] = prop
})
let sidoCode = undefined
const sgg: Sigungu[] = []

const flush = () => {
  sgg.forEach((sgg) => {
    console.log(sgg.toQuery())
  })
  sgg.splice(0, sgg.length)
}
class Sigungu {
  code: string
  name: string
  sidoCode: string
  constructor(code, name, sidoCode) {
    this.code = code
    this.name = name
    this.sidoCode = sidoCode
  }
  toQuery(): void {
    console.log(
      `INSERT INTO regions (rg_name, rg_region_code, rg_sido_ref) VALUES ('${this.name}', '${this.code}', ${this.sidoCode});`
    )
  }
}
describe('regins', () => {
  test('read', () => {
    fs.createReadStream(path.resolve('./doc/region.csv'))
      .pipe(csv())
      .on('data', function (data) {
        try {
          // console.log('Name is: ' + data.NAME)
          // console.log('Age is: ' + data.AGE)
          const [code, regionName] = data.REGION.split(' ')
          if (code.length === 2) {
            // 시도
            flush()
            sidoCode = sidoMap[regionName]
          } else {
            // 시군구
            sgg.push(new Sigungu(code, regionName, sidoCode))
          }

          //perform the operation
        } catch (err) {
          console.error(err)
        }
      })
      .on('end', function () {
        //some final operation
      })
  })
})
