<script lang="ts">
  import type { Journey } from '@/common/entity/journey/Journey.js'
  export let journey: Journey
</script>

<button class="nude {journey.getDifficultyText()}"
  ><span class="lvl">{journey.officialDifficulty}</span>
</button>

<style lang="scss">
  button.nude {
    padding: 4px;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 0 2px #0000008d, 1px 1px 8px #0000004d;
    position: relative;
    overflow: hidden;
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: 700;
    &.easy {
      background-color: #00ff00;
      color: #777;
    }
    &.medium {
      background-color: #ffee00;
      color: #444;
    }
    &.hard {
      background-color: #ef6200;
      color: white;
    }
    &.extreme {
      background-color: #000000;
      color: white;
    }
  }
</style>
