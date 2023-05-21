<script lang="ts">
  import ActionIcon from '@common/ActionIcon.svelte'
  const titleVisible = false
</script>

<span class="badge">
  <ActionIcon
    on:click
    type="custom"
    icon="/favicon.svg"
    size="md"
  />{#if titleVisible}<span class="name">Ambulo</span>{/if}
</span>

<style lang="scss">
  .badge {
    display: flex;
    align-items: center;
    border-radius: 20px;
    // ox-shadow: 2px 2px 4px #0000004d, 0 0 2px #0000003d;
    .name {
      font-family: Lato, sans-serif;
      font-size: 18px;
      padding-right: 8px;
    }
  }
</style>
