const DEFAULT_GEO_SETTING: PositionOptions = {
  enableHighAccuracy: false,
  maximumAge: 5 * 1000, // millis
  timeout: 10 * 1000 // maximum pending time, millis
}

export class GeoLocation {
  private permStatus: PermissionStatus
  private setting: PositionOptions
  private watchId: number | undefined
  constructor(setting: PositionOptions = DEFAULT_GEO_SETTING) {
    this.setting = setting
  }
  queryPermission(): Promise<PermissionState> {
    return new Promise((resolve, reject) => {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((status) => {
          this.permStatus = status
          resolve(status.state)
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }
  requestPermission(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, this.setting)
    })
  }
  scan(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, this.setting)
    })
  }
  watchPosition(success: PositionCallback, error: PositionErrorCallback) {
    this.watchId = navigator.geolocation.watchPosition(
      success,
      error || (() => {}),
      this.setting
    )
  }
  clearWatch() {
    navigator.geolocation.clearWatch(this.watchId)
  }
}
