<script lang="ts">
  import MenuItem from '../MenuItem.svelte'
  import router from '@router'
  import { uiState } from '@/apps/main/domain/ui/index.js'
  
</script>

<MenuItem>
  <button
    class="nude"
    on:click={() => router.push('/').then(() => uiState.setMenuVisible(false))}
    >HOME</button
  >
</MenuItem>

<style lang="scss">
  .nude {
    flex: 1 1 auto;
    text-align: left;
  }
</style>
