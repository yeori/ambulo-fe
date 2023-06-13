<script lang="ts">
  import type { Duration } from './Festival.js'

  export let duration: Duration
</script>

<h4>
  {#if duration.isOneDay()}
    <span class="date oneday">{duration.start}</span>
  {:else if duration.isSameYear()}
    <span class="year">{duration.start.substring(0, 4)}</span><span
      class="date md"
      ><span>{duration.start.substring(5)}</span> ~
      <span>{duration.end.substring(5)}</span></span
    >
  {:else}
    <span class="date ymd">{duration.start}</span><span class="date ymd"
      >{duration.end}</span
    >
  {/if}
</h4>

<style lang="scss">
  h4 {
    display: flex;
    font-size: inherit;
    font-weight: 400;
    border-radius: 6px;
    overflow: hidden;
    & > span {
      padding: 6px 8px;
      color: #142d4c;
      &.year {
        background-color: #8ef6e4;
      }
      &.date {
        background-color: #fcf4d9;
        &.ymd {
          border-radius: 6px;
        }
      }
    }
    .ymd + .ymd {
      margin-left: 6px;
    }
  }
</style>
