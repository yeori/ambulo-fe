export interface IMapPos {
  lat: number
  lng: number
  alt: number
  /**
   * returns vendor specific position instance
   */
  toLatLng(): any
}
export interface IMapPath {
  addPosition(pos: GeolocationPosition): IMapPath
}
export interface IMapSpec {
  createPath(): IMapPath
  /**
   *
   * @param pos {lat, lng} location info
   * @param zoomLevel
   */
  render(pos: IMapPos, zoomLevel: number): IMapSpec
}
