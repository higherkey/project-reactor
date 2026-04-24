<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { game } from '$lib/stores/game.svelte';

  let filled = $state(0);
  let timeout: any;
  let endTimeout: any;

  function fillNext() {
    if (filled < 9) {
      filled++;
      game.isValid = filled === 9;
      
      if (filled === 9) {
        // Round ends on its own if no one taps within 1.5 seconds of completion
        endTimeout = setTimeout(() => {
          if (game.gameState === 'active') {
            game.gameState = 'roundOver';
          }
        }, 1500);
      } else {
        // Randomly speed up or slow down
        const delay = filled === 8 ? 1200 : (300 + Math.random() * 500);
        timeout = setTimeout(fillNext, delay);
      }
    }
  }

  onMount(() => {
    fillNext();
  });

  onDestroy(() => {
    clearTimeout(timeout);
    clearTimeout(endTimeout);
  });
</script>

<div class="grid-fill">
  <div class="grid">
    {#each Array(9) as _, i}
      <div class="cell" class:active={i < filled}></div>
    {/each}
  </div>
</div>

<style>
  .grid-fill {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 10px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 40px);
    grid-template-rows: repeat(3, 40px);
    gap: 8px;
  }

  .cell {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cell.active {
    background: var(--neon-green);
    border-color: var(--neon-green);
    box-shadow: 0 0 15px var(--neon-green);
    transform: scale(1.05);
  }
</style>
