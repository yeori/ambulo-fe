<script lang="ts">
  export let journey
  export let size: 'sm' | 'md' | 'lg' = 'md'
</script>

<button class="nude journey theme-{journey.themeRef} {size}" on:click>
  <h5><span>{journey.name}</span></h5>
</button>

<style lang="scss">
  .journey {
    background-color: white;
    display: flex;
    align-items: center;
    border-radius: 20px;
    box-shadow: 0 0 2px #0000008d, 1px 1px 8px #0000004d;
    position: relative;
    overflow: hidden;
    cursor: pointer;

    &.sm {
      padding-left: 30px;
      height: 24px;
      &:after {
        width: 24px;
        height: 24px;
      }
    }
    &.md {
      padding-left: 34px;
      height: 28px;
      &:after {
        width: 28px;
        height: 28px;
      }
    }
    &.lg {
      padding-left: 38px;
      height: 32px;
      &:after {
        width: 32px;
        height: 32px;
      }
    }

    &:after {
      content: '';
      font-weight: 700;
      font-size: 16px;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;

      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 20px;
    }
    &.theme-100:after {
      background-color: #017b09;
      content: '해';
    }
    &.theme-200:after {
      background-color: #0e80ff;
      content: '남';
    }
    &.theme-300:after {
      background-color: #d24403;
      content: '서';
    }
  }
</style>
