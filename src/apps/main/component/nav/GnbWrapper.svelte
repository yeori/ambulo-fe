<script lang="ts">
  import MainNav from './MainNav.svelte'
  import MapGnb from './MapGnb.svelte'
  export let router
</script>

{#if $router.path === '/map'}
  <MapGnb />
{:else}
  <MainNav />
{/if}
