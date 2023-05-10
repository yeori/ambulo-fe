<script lang="ts">
  import util from "../../../service/util/index.js";
  const names = ["bg000.jpg", "bg001.jpg", "bg002.jpg"];
  // console.log(util);
</script>

<main class="abs-fill">
  <div
    class="bg"
    style="{`background-image: url(/images/bg/${util.rand.pick(names)})`}"
  ></div>
  <div class="ambulo abs-center">
    <h3 class="shadow">Ambulo</h3>
    <h5 class="shadow">ready to start</h5>
    <!-- <button class="nude">START</button> -->
  </div>
</main>

<style lang="scss">
  main {
    z-index: 1024;
    .bg {
      position: fixed;
      inset: 0;
      background-position: center;
      background-size: cover;
      z-index: 0;
      filter: grayscale(0.6);
    }
    .ambulo {
      display: flex;
      flex-direction: column;
      align-items: center;
      row-gap: 4vmin;
      z-index: 10;
      h3 {
        font-size: 10vmin;
        font-family: "Lato", sans-serif;
        margin: 0;
      }
      h5 {
        font-size: 5vmin;
        font-family: "Lato", sans-serif;
        margin: 0;
      }
    }
    .shadow {
      text-shadow: 1px 1px 1px #ffffff, -1px -1px 1px #ffffff,
        1px -1px 1px #ffffff, -1px 1px 1px #ffffff;
    }
  }
</style>
