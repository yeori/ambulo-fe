<script lang="ts">
  // import { GeoLocation } from '@main/component/geolocation/GeoLocation.js'
  import MapView from '../component/map/MapView.svelte'

  // const geo = new GeoLocation()
  // const myloc = () => {
  //   geo
  //     .checkPermission()
  //     .then((pos: GeolocationPosition) => {
  //       const { coords, timestamp } = pos
  //       const {
  //         accuracy,
  //         altitude: alt,
  //         altitudeAccuracy,
  //         heading,
  //         latitude: lat,
  //         longitude: lng,
  //         speed
  //       } = coords
  //       console.table(coords)
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }
</script>

<section>
  <MapView />
</section>

<style lang="scss">
  section {
    flex: 1 1 auto;
  }
</style>
