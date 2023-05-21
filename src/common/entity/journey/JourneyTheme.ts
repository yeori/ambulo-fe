import type { RouteProvider } from './RouteConst.js'

/*

provider
: 
"U"
routeDesc
: 
"지정된 theme이 없는 경우"
routeIndex
: 
"T_NO_THEME"
routeName
: 
"없음"
routeType
: 
"W"
seq
: 
1
*/
export type JourenyThemeType = {
  pk: number
  seq: number
  routeName: string
  routeType: string
  routeIndex: string
  routeDesc: string
  provider: RouteProvider
}

export class JourneyTheme {
  pk: number
  seq: number
  routeName: string
  routeType: string
  routeIndex: string
  routeDesc: string
  provider: RouteProvider
  constructor(data: JourenyThemeType) {
    Object.keys(data).forEach((prop) => {
      this[prop] = data[prop]
    })
  }

  static wrap(data: JourenyThemeType): JourneyTheme {
    data.pk = undefined
    return new JourneyTheme(data)
  }
}
