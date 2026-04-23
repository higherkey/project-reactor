<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/stores/game.svelte';

  let gridA = $state<boolean[]>([]);
  let gridB = $state<boolean[]>([]);

  function generate() {
    const isSymmetric = Math.random() > 0.5;
    
    // Generate grid A
    gridA = Array(9).fill(false).map(() => Math.random() > 0.5);
    
    if (isSymmetric) {
      // Mirror Grid A to Grid B
      gridB = [
        gridA[2], gridA[1], gridA[0],
        gridA[5], gridA[4], gridA[3],
        gridA[8], gridA[7], gridA[6]
      ];
    } else {
      gridB = Array(9).fill(false).map(() => Math.random() > 0.5);
    }
    
    // Check if symmetric
    const checkSymmetric = gridB.every((val, i) => {
       const row = Math.floor(i / 3);
       const col = i % 3;
       const mirrorCol = 2 - col;
       return val === gridA[row * 3 + mirrorCol];
    });

    game.isValid = checkSymmetric;
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
    gap: 20px;
    align-items: center;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 20px);
    grid-template-rows: repeat(3, 20px);
    gap: 4px;
  }

  .cell {
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }

  .cell.active {
    background: var(--neon-blue);
    box-shadow: 0 0 10px var(--neon-blue);
  }

  .divider {
    width: 2px;
    height: 60px;
    background: var(--border-glass);
  }
</style>
