<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/stores/game.svelte';

  let dots = $state<Array<{x: number, y: number}>>([]);
  let showDots = $state(true);
  let count = $state(0);

  function generate() {
    count = Math.floor(Math.random() * 8) + 2; // 2 to 9
    dots = Array(count).fill(0).map(() => ({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10
    }));
    
    game.isValid = count % 2 === 0;
    
    setTimeout(() => {
      showDots = false;
    }, 600);
  }

  onMount(() => {
    generate();
  });
</script>

<div class="flash-count">
  {#if showDots}
    <div class="dot-container">
      {#each dots as dot}
        <div class="dot" style="left: {dot.x}%; top: {dot.y}%;"></div>
      {/each}
    </div>
  {:else}
    <div class="question neon-text-blue">EVEN?</div>
  {/if}
</div>

<style>
  .flash-count {
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .dot-container {
    position: absolute;
    inset: 0;
  }

  .dot {
    position: absolute;
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 0 10px white;
  }

  .question {
    font-size: 3rem;
    font-weight: 900;
  }
</style>
