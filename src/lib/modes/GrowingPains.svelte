<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { game } from '$lib/stores/game.svelte';

  let radius = $state(20);
  let maxRadius = 130; 
  let growthRate = 0.5;
  let animationFrame: number;

  function update() {
    radius += growthRate;
    
    // game.isValid is true when circle is "large enough" to be touching the edge
    game.isValid = radius >= maxRadius - 5;

    if (radius > maxRadius + 15) {
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
    class:valid={game.isValid}
  ></div>
  <div class="boundary"></div>
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
    transition: border-color 0.1s, box-shadow 0.1s;
  }

  .circle.valid {
    border-color: var(--neon-green);
    box-shadow: 0 0 30px var(--neon-green);
  }

  .boundary {
    position: absolute;
    width: 260px; /* maxRadius * 2 */
    height: 260px;
    border: 2px dashed rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
</style>
