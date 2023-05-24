<script lang="ts">
  import { journeyThemeStore } from '@/common/entity/journey/journey-store.js'
  import JourneyThemeBadge from '@/common/badge/JourneyThemeBadge.svelte'
  import { getContext } from 'svelte'
  const provider = getContext<any>('provider')
</script>

<ul>
  {#each journeyThemeStore.getValidThemes() as theme}
    <li>
      <JourneyThemeBadge
        journeyTheme={theme}
        on:click={() => provider.changeTheme(theme)}
      />
    </li>
  {/each}
</ul>

<style lang="scss">
  ul {
    li {
      margin-bottom: 8px;
    }
  }
</style>
