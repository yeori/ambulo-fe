<script lang="ts">
  import AppButton from '@/common/form/AppButton.svelte'
  import { createEventDispatcher } from 'svelte'
  import userLocation from './geolocation/user-location.js'
  import modal from '@/common/toast/index.js'
  const dispatch = createEventDispatcher()

  const error = [
    '@error',
    '@permission.error.user',
    '@permission.error.system',
    '@permission.error.timeout',
    '@permission.success'
  ]
  const requestPermission = () => {
    dispatch('close')
    userLocation
      .requestPermission()
      .then((res) => {
        modal.info(error[4], 5000)
      })
      .catch((err) => {
        const msg = error[err.code]
        modal.error(msg, 5000)
      })
  }
</script>

<section>
  <header>권한필요</header>
  <div class="imgview" style="background-image: url(/images/geo-perm.png)" />
  <p>권한승인을 누른 후 권한을 허가해주세요.</p>
  <footer>
    <AppButton text="권한 승인" on:click={requestPermission} />
  </footer>
</section>

<style lang="scss">
  section {
    header {
      margin-bottom: 8px;
      font-weight: 600;
    }
    footer {
      margin-top: 8px;
    }
    .imgview {
      height: 159px;
      filter: grayscale(0.4);
    }
  }
</style>
