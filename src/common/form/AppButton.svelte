<script lang="ts">
  import AppIcon from '../AppIcon.svelte'

  export let icon = undefined
  export let text = 'Button'
  export let theme = 'blue'
  export let round: string | 0 = 0
  export let shadow: boolean = true
  export let size: 'sm' | 'md' | 'lg' = 'md'
</script>

<button
  class={`nude ${size} ${theme} ${shadow ? 'shadow' : ''}`}
  class:round
  on:click
  >{#if icon}<AppIcon {icon} />{/if} <span class="lbl">{text}</span></button
>

<style lang="scss">
  button {
    &.shaow {
      box-shadow: 0 0 1px #0000004d, 0 2px 4px #00000045;
    }
    &.round {
      border-radius: 48px;
    }
    &.sm {
      padding: 6px 12px;
      font-size: 1rem;
    }
    &.md {
      padding: 8px 16px;
      font-size: 1.15rem;
    }
  }
</style>
