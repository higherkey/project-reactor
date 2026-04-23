<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { game } from '$lib/stores/game';

  let radius = $state(20);
  let maxRadius = 130; // Slightly less than half of 280px container
  let growthRate = 0.5;
  let animationFrame: number;

  function update() {
    radius += growthRate;
    
    // game.isValid is true when circle is "large enough" to be touching the edge
    game.isValid = radius >= maxRadius - 10;

    if (radius > maxRadius + 20) {
        // Reset if it grows too far without being tapped
        radius = 20;
    }

    animationFrame = requestAnimationFrame(update);
  }

  onMount(() => {
    update();
  });

  onDestroy(() => {
    cancelAnimationFrame(animationFrame);
  });
</script>

<div class="growing-pains">
  <div 
    class="circle" 
    style="width: {radius * 2}px; height: {radius * 2}px;"
  ></div>
  <div class="label" class:valid={game.isValid}>
    {game.isValid ? 'TAP NOW!' : 'WAIT...'}
  </div>
</div>

<style>
  .growing-pains {
    position: relative;
    width: 280px;
    height: 280px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .circle {
    position: absolute;
    border: 4px solid var(--neon-blue);
    border-radius: 50%;
    box-shadow: 0 0 20px var(--neon-blue);
    transition: border-color 0.1s;
  }

  .label {
    position: relative;
    z-index: 10;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--text-dim);
    transition: all 0.2s;
  }

  .label.valid {
    color: var(--neon-green);
    transform: scale(1.2);
    text-shadow: 0 0 10px var(--neon-green);
  }
</style>
