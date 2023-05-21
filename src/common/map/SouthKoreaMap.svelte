<script lang="ts">
  // TODO 각 시도별 아이콘 필요함

  import {
    Province,
    provinceStore
  } from '../../apps/main/domain/province/province-store.js'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  let mapEl
  const setActiveProvince = (province: Province) => {
    const idx = $provinceStore.provinces.findIndex((p) => province === p)
    $provinceStore.setActiveProvince(province)
    dispatch('province', province)
  }
  /*
  width="440.23737"
    height="630.5871"
    */
</script>

<div class="sk-map">
  <div class="view">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="00 00 440.23737 630.5871"
      fill="#fff"
      stroke="#efefef"
      bind:this={mapEl}
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00416A" />
          <stop offset="0%" stop-color="#799F0C" />
          <stop offset="100%" stop-color="#FFE000" />
        </linearGradient>
      </defs>
      {#each $provinceStore.provinces as province}
        <path
          id={province.id}
          class:active={$provinceStore.activeProvince === province}
          data-title={province.name}
          d={province.toPathText()}
          style={`fill: ${province.theme.bgc}`}
          on:click={() => setActiveProvince(province)}
          on:keyup={() => setActiveProvince(province)}
        />
      {/each}
    </svg>
  </div>
</div>

<style lang="scss">
  .sk-map {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
    .view {
      max-width: 440px;
      width: 100%;
      overflow: hidden;
      svg {
        outline: none;
        cursor: pointer;
        path {
          // transition: filter 0.15s ease-in-out;

          // &:hover {
          //   filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.4));
          // }
          &.active {
            // fill: url(#gradient);
            // fill: #effa90;
            // stroke: #effa90;
            filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.4));
          }
        }
      }
    }
  }
</style>
