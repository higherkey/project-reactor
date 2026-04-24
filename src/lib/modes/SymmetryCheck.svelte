<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/stores/game.svelte';

  let gridA = $state<boolean[]>([]);
  let gridB = $state<boolean[]>([]);

  function generate() {
    const isSymmetric = Math.random() > 0.5;
    
    // Generate grid A (3x3)
    gridA = Array(9).fill(false).map(() => Math.random() > 0.4);
    
    if (isSymmetric) {
      // Mirror Grid A to Grid B
      gridB = [
        gridA[2], gridA[1], gridA[0],
        gridA[5], gridA[4], gridA[3],
        gridA[8], gridA[7], gridA[6]
      ];
    } else {
      gridB = Array(9).fill(false).map(() => Math.random() > 0.4);
      // Ensure it's not accidentally symmetric
      const checkSymmetric = gridB.every((val, i) => {
         const row = Math.floor(i / 3);
         const col = i % 3;
         const mirrorCol = 2 - col;
         return val === gridA[row * 3 + mirrorCol];
      });
      if (checkSymmetric) {
         gridB[0] = !gridB[0];
      }
    }
    
    game.isValid = isSymmetric;
  }

  onMount(() => {
    generate();
  });
</script>

<div class="symmetry-check">
  <div class="grid">
    {#each gridA as cell}
      <div class="cell" class:active={cell}></div>
    {/each}
  </div>
  <div class="divider"></div>
  <div class="grid">
    {#each gridB as cell}
      <div class="cell" class:active={cell}></div>
    {/each}
  </div>
</div>

<style>
  .symmetry-check {
    display: flex;
    gap: 30px;
    align-items: center;
    padding: 10px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 32px);
    grid-template-rows: repeat(3, 32px);
    gap: 6px;
  }

  .cell {
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  .cell.active {
    background: var(--neon-blue);
    border-color: var(--neon-blue);
    box-shadow: 0 0 15px var(--neon-blue);
  }

  .divider {
    width: 2px;
    height: 100px;
    background: linear-gradient(to bottom, transparent, var(--border-glass), transparent);
  }
</style>
