<script lang="ts">
  const names = ["bg001.jpg"];
</script>

<div style="{`background-image: url(/images/bg/${names[0]})`}"></div>

<style lang="scss">
  div {
    position: fixed;
    inset: 0;
    background-position: center;
    background-size: cover;
    z-index: 0;
    filter: grayscale(0.6);
  }
</style>
