<script lang="ts">
  let clazz: string = ''
  export { clazz as class }
  export let type: string = 'ambulo'
  export let icon: string = undefined
  export let hover: string = undefined
  export let color: string = '#777'
  export let size: 'sm' | 'md' | 'lg' = 'sm'

  const getIconPath = () =>
    type === 'custom' ? icon : `/images/icon/${icon}.svg`

  const getHoverIconPath = () =>
    type === 'custom' ? icon : `/images/icon/${hover || icon}.svg`
</script>

<span
  class="icon {size} {clazz}"
  class:ambulo={type === 'ambulo'}
  class:custom={type === 'custom'}
  class:sm={[size]}
  style={`--icon-color:${color} ;--ambulo-icon-path: url("${getIconPath()}"); --ambulo-hover-path: url("${getHoverIconPath()}")`}
/>

<style lang="scss">
  .icon {
    background-size: contain;
    &.ambulo {
      mask-image: var(--ambulo-icon-path);
      -webkit-mask-image: var(--ambulo-icon-path);

      mask-repeat: no-repeat;
      -webkit-mask-repeat: no-repeat;
      mask-position: center;
      -webkit-mask-position: center;
      mask-size: cover;
      -webkit-mask-size: cover;
      background-color: var(--icon-color);
    }
    &.custom {
      background-position: center;
      background-image: var(--ambulo-icon-path);
      background-repeat: no-repeat;
    }
    &.sm {
      width: 1.25rem;
      height: 1.25rem;
    }
    &.md {
      width: 1.5rem;
      height: 1.5rem;
    }
    &.lg {
      width: 1.75rem;
      height: 1.75rem;
    }
  }
</style>
