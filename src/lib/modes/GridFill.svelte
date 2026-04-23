<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { game } from '$lib/stores/game';

  let filled = $state(0);
  let timeout: number;

  function fillNext() {
    if (filled < 9) {
      filled++;
      game.isValid = filled === 9;
      timeout = setTimeout(fillNext, 400 + Math.random() * 600) as any;
    }
  }

  onMount(() => {
    fillNext();
  });

  onDestroy(() => {
    clearTimeout(timeout);
  });
</script>

<div class="grid-fill">
  <div class="grid">
    {#each Array(9) as _, i}
      <div class="cell" class:active={i < filled}></div>
    {/each}
  </div>
  <div class="label" class:valid={filled === 9}>
    {filled === 9 ? 'FULL!' : 'WAIT...'}
  </div>
</div>

<style>
  .grid-fill {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 30px);
    gap: 5px;
  }

  .cell {
    width: 30px;
    height: 30px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    transition: all 0.2s;
  }

  .cell.active {
    background: var(--neon-green);
    box-shadow: 0 0 15px var(--neon-green);
  }

  .label {
    font-weight: 900;
    color: var(--text-dim);
  }

  .label.valid {
    color: var(--neon-green);
  }
</style>
