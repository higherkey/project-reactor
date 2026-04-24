<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/stores/game.svelte';

  const icons = ['▲', '■', '●', '◆', '★', '✖', '✚', '⬢'];
  let grid = $state<string[]>([]);
  
  function generate() {
    const baseIcon = icons[Math.floor(Math.random() * icons.length)];
    let otherIcon = icons[Math.floor(Math.random() * icons.length)];
    while (otherIcon === baseIcon) {
        otherIcon = icons[Math.floor(Math.random() * icons.length)];
    }

    const hasOddOne = Math.random() > 0.4; // 60% chance of odd one
    grid = Array(12).fill(baseIcon);
    
    if (hasOddOne) {
        const oddIdx = Math.floor(Math.random() * 12);
        grid[oddIdx] = otherIcon;
    }
    
    game.isValid = hasOddOne;
  }

  onMount(() => {
    generate();
  });
</script>

<div class="odd-one-out">
  {#each grid as icon}
    <div class="icon">{icon}</div>
  {/each}
</div>

<style>
  .odd-one-out {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 16px;
  }

  .icon {
    font-size: 2.2rem;
    color: var(--neon-pink);
    text-shadow: 0 0 10px rgba(255, 0, 122, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
