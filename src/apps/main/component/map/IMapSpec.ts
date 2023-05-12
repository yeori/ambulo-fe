export interface IMapPos {
  lat: number
  lng: number
  alt: number
  /**
   * returns vendor specific position instance
   */
  toLatLng(): any
}
export interface IMapSpec {
  /**
   *
   * @param pos {lat, lng} location info
   * @param zoomLevel
   */
  render(pos: IMapPos, zoomLevel: number): IMapSpec
}
