export class GooglePos implements GooglePos {
  constructor(private readonly geoPos: GeolocationPosition) {}
  get lat() {
    return this.geoPos.coords.latitude
  }
  get lng() {
    return this.geoPos.coords.longitude
  }
  get alt() {
    return undefined
  }
  toLatLng() {
    return new google.maps.LatLng(this.lat, this.lng)
  }
}
