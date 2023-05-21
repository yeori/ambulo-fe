<script lang="ts">
  import AppIcon from './AppIcon.svelte'

  export let type: string = 'ambulo'
  export let icon: string = undefined
  export let hover: string = undefined
  export let color: string = '#777'
  export let size: 'sm' | 'md' | 'lg' = 'sm'
</script>

<button class="nude" on:click>
  <AppIcon {type} {icon} {hover} {color} {size} />
</button>

<style lang="scss">
  button {
    display: inline-flex;
    align-items: center;
    padding: 0;
    border-radius: 20px;
    padding: 6px;
    &:hover {
      background-color: #eeeeee6d;
      // background-color: red;
      // :global(.icon) {
      //   &.ambulo {
      //     mask-image: var(--ambulo-hover-path);
      //     -webkit-mask-image: var(--ambulo-hover-path);
      //   }
      // }
    }
  }
</style>
