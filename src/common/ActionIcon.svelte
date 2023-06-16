<script lang="ts">
  import AppIcon from './AppIcon.svelte'

  let clazz: string = ''
  export { clazz as class }
  export let type: string = 'ambulo'
  export let icon: string = undefined
  export let hover: string = undefined
  export let color: string = '#777'
  export let theme: string = undefined
  export let size: 'sm' | 'md' | 'lg' = 'sm'
  export let radius: string = '20px'
  export let shadow: boolean = false
</script>

<button
  class="nude {theme} {shadow ? 'shadow' : ''} {clazz || ''}"
  style="--btn-radius: {radius}"
  on:click
>
  <AppIcon {type} {icon} {hover} {color} {size} />
</button>

<style lang="scss">
  button {
    display: inline-flex;
    align-items: center;
    padding: 0;
    border-radius: var(--btn-radius, 20px);
    padding: 6px;
    &.shadow {
      filter: drop-shadow(0px 0px 4px #0000008d);
    }
    :global(.icon) {
      flex: 1 1 auto;
    }
  }
</style>
