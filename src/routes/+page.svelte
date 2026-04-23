<script lang="ts">
  import { game } from '$lib/stores/game';
  import Quadrant from '$lib/components/Quadrant.svelte';
  import InstructionArea from '$lib/components/InstructionArea.svelte';
</script>

<main class="game-container">
  <div class="grid-layer">
    <Quadrant index={0} color="blue" rotation={0} />
    <Quadrant index={1} color="pink" rotation={180} />
    <Quadrant index={2} color="green" rotation={90} />
    <Quadrant index={3} color="yellow" rotation={270} />
  </div>

  <div class="center-layer">
    <InstructionArea />
  </div>
</main>

<style>
  .game-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    background: var(--bg-dark);
  }

  .grid-layer {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 4px;
    padding: 4px;
  }

  .center-layer {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  }
</style>
