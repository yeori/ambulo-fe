declare namespace kakao.maps {
  declare namespace event {
    /**
     *
     * @param target
     * @param eventName
     * @param callback
     */
    export function addListener(
      target: any,
      eventName: string,
      callback: (e?: MouseEvent) => void
    )
  }
  export function load(callback)
  /**
   * 지도 위에 올라가는 각종 도형의 선 스타일을 의미한다.
   * 스타일은 패턴에 따라 11종류가 있으며 그 값은 문자열로 지정한다.
   *
   * @see https://apis.map.kakao.com/web/documentation/#StrokeStyles
   */
  export const enum StrokeStyles {
    solid,
    shortdash,
    shortdot,
    shortdashdot,
    shortdashdotdot,
    dot,
    dash,
    dashdot,
    longdash,
    longdashdot,
    longdashdotdot
  }
  export interface MouseEvent {
    latLng: LatLng
    point: Point
  }
  export type KakoMapOption = {
    center: any
    level: number
    mapTypeId: any
    draggable?: boolean
    scrollwheel?: boolean
    disableDoubleClick?: boolean
    disableDoubleClickZoom?: boolean
    projectionId?: string
    tileAnimation?: boolean
    keyboardShortcuts?: boolean | any
  }
  /**
   * 화면 좌표(픽셀 단위) 정보를 담고 있는 객체
   */
  export class Point {
    constructor(x: number, y: number)
    equals(other: Point): boolean
    toString(): string
  }
  export class LatLng {
    constructor(latitude: number, longitude: number)
    getLat(): number
    getLng(): number
    equals(latlng: LatLng): boolean
    toString(): string
    /**
     *
     */
    toCoords(): Coords
  }
  /**
   * Wcongnamul 좌표 정보를 가지고 있는 객체를 생성한다.
   */
  export class Coords {
    /**
     *
     * @param x x좌표
     * @param y y좌표
     */
    constructor(x: number, y: number)
    toString(): string
  }
  /**
   * poliyline 옵션값
   */
  export class PolylineOption {
    /**
     * 화살표 여부
     */
    endArrow?: boolean = false
    path: Array<LatLng> | Array<Array<LatLng>>
    /**
     * 선 두께
     */
    strokeWeight?: number = 3
    strokeColor?: string = '#F100000'
    strokeOpacity?: number = 0.6
    strokeStyle?: StrokeStyles = StrokeStyles.solid
  }
  export class Polyline implements IShape {
    constructor(option: PolylineOption)
    /**
     * 폴리라인이 올라가있는 지도를 반환한다.
     * @returns 카카오지도 인스턴스
     */
    getMap(): Map
    /**
     * 주어진 지도에 poliyline을 표시함
     * @param mapHandle polyline이 올라갈 지도 인스턴스
     */
    setMap(mapHandle: Map): void
    /**
     * 주어진 좌표들을 polyline으로 지도위에 그려줌
     * @param path polyline을 구성하는 좌표들
     */
    setPath(path: Array<LatLng>): void
    /**
     * polyline의 총 길이를 m(미터)단위로 반환한다.
     * @returns 총길이(meter)
     */
    getLength(): number
    setOptions(option: any)
  }
  export class CircleOption {
    map: Map
    center: LatLng
    fillColor?: string = '#F10000'
    fillOpacity?: number = 0
    radius: number
    strokeWeight?: number = 3
    strokeColor?: string = '#F10000'
    strokeOpacity?: number = 0.6
    strokeStyle?: StrokeStyles = StrokeStyles.solid
    zIndex?: number
  }
  export class Circle {
    constructor(option: CircleOption)
    /**
     * 주어진 지도에 circle 표시함
     * @param mapHandle polyline이 올라갈 지도 인스턴스
     */
    setMap(mapHandle: Map): void
    /**
     * circle이 올라가있는 지도를 반환한다.
     * @returns 카카오지도 인스턴스
     */
    getMap(): Map
    setOptions(options: CircleOption)
    setPosition(position: LatLng)
    getPosition(): LatLng
    /**
     *
     * @param radius 반지름(meter)
     */
    setRadius(radius: number)
    /**
     * 반지름(meter)
     */
    getRadius(): number

    getBounds(): LatLngBounds

    setZIndex(zIndex: number)
    getZINdex(): number
  }
  export class OverlayOption {
    clickable?: boolean = false
    content: Node | String
    map: Map | RoadView
    position: LatLng | Viewpoint
    xAnchor?: number = 0.5
    yAnchor?: number = 0.5
    zIndex?: number
  }
  export class CustomOverlay {
    constructor(option: OverlayOption)
    setMap(map_or_roadview: Map)
    getMap(): Map
    setPosition(position: LatLng)
    getPosition(): LatLng
    setContent(html: string)
    setVisible(visible: boolean)
    setZIndex(zIndex: number)
    getZIndex(): number
    setAltitude(altitude: number)
    setAltitude(): number
    setRange(range: number)
    setRange(): number
  }
  export class Map {
    constructor(el: HTMLElement, options: KakoMapOption)
  }
}
// declare module KakaoMap {
//   maps: {
//     Polyline: any
//   }
// }
// interface Window {
//   kakao: KakaoMap
// }
