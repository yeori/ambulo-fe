<script lang="ts">
  import AppIcon from './AppIcon.svelte'

  export let type: string = 'ambulo'
  export let icon: string = undefined
  export let hover: string = undefined
  export let color: string = '#777'
  export let theme: string = undefined
  export let size: 'sm' | 'md' | 'lg' = 'sm'
  export let radius: string = '20px'
</script>

<button class="nude {theme}" style="--btn-radius: {radius}" on:click>
  <AppIcon {type} {icon} {hover} {color} {size} />
</button>

<style lang="scss">
  button {
    display: inline-flex;
    align-items: center;
    padding: 0;
    border-radius: var(--btn-radius, 20px);
    padding: 6px;
  }
</style>
