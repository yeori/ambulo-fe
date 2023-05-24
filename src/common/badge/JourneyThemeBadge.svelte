<script lang="ts">
  import type { JourneyTheme } from '@entity/journey/JourneyTheme.js'
  export let journeyTheme: JourneyTheme

  const char = () => journeyTheme.routeName.charAt(0)
</script>

<button class="nude jtheme" on:click>
  <span class="logo thm-{journeyTheme.seq}">{char()}</span><span class="name"
    >{journeyTheme.routeName}</span
  >
</button>

<style lang="scss">
  button.nude {
    display: flex;
    align-items: center;
    column-gap: 8px;
    padding: 0;
    border-radius: 28px;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 0 2px #0000008d, 1px 1px 8px #0000004d;
    font-size: 12px;
    .logo {
      font-weight: 700;
      width: 28px;
      height: 28px;
      border-radius: 28px;
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      &.thm-100 {
        background-color: #017b09;
      }
      &.thm-200 {
        background-color: #0e80ff;
      }
      &.thm-300 {
        background-color: #d24403;
      }
    }
    .name {
      padding-right: 8px;
    }
  }
</style>
