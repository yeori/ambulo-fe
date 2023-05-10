export const enum Permission {
  GEO = 'geolocation'
}

const geoSettings: PositionOptions = {
  enableHighAccuracy: false,
  maximumAge: 30000, // millis
  timeout: 20000 // maximum pending time, millis
}

const requestPermission = (perm: Permission) => {
  return new Promise((resolve, reject) => {
    navigator.permissions.query({ name: perm }).then((result) => {
      if (result.state == 'granted') {
        navigator.geolocation.getCurrentPosition(resolve, reject, geoSettings)
      } else if (result.state == 'prompt') {
        navigator.geolocation.getCurrentPosition(resolve, reject, geoSettings)
      } else if (result.state == 'denied') {
        reject({ code: -1, message: 'denied by system' })
      }
    })
  })
}

export default {
  requestPermission
}
