<script lang="ts">
  import AppIcon from '../AppIcon.svelte'

  export let icon = undefined
  export let text = 'Button'
  export let theme = 'blue'
  export let round: string | 0 = 0
</script>

<button class={`nude ${theme}`} class:round on:click
  >{#if icon}<AppIcon {icon} />{/if} <span class="lbl">{text}</span></button
>

<style lang="scss">
  button {
    box-shadow: 0 0 1px #0000004d, 0 2px 4px #00000045;
    &.round {
      border-radius: 48px;
    }
    &.blue {
      background-color: #0069eb;
      color: white;
      &:hover {
        background-color: #367ed6;
      }
      &:active {
        background-color: #0156bd;
      }
    }
  }
</style>
