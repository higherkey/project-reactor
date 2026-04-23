<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/stores/game';

  const icons = ['▲', '■', '●', '◆', '★', '✖'];
  let grid = $state<string[]>([]);
  
  function generate() {
    const baseIcon = icons[Math.floor(Math.random() * icons.length)];
    let otherIcon = icons[Math.floor(Math.random() * icons.length)];
    while (otherIcon === baseIcon) {
        otherIcon = icons[Math.floor(Math.random() * icons.length)];
    }

    const isActuallyCorrect = Math.random() > 0.5;
    grid = Array(9).fill(baseIcon);
    
    if (isActuallyCorrect) {
        const oddIdx = Math.floor(Math.random() * 9);
        grid[oddIdx] = otherIcon;
    }
    
    game.isValid = isActuallyCorrect;
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
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 10px;
  }

  .icon {
    font-size: 2rem;
    color: var(--neon-pink);
    text-shadow: 0 0 5px rgba(255, 0, 122, 0.4);
  }
</style>
