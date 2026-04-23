<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { game } from '$lib/stores/game';

  let sides = $state(3);
  let targetSides = $state(4);
  let animationFrame: number;
  let lastUpdate = 0;

  const names: Record<number, string> = {
    3: 'Triangle',
    4: 'Square',
    5: 'Pentagon',
    6: 'Hexagon',
    7: 'Heptagon',
    8: 'Octagon'
  };

  function getPoints(sides: number, radius: number) {
    const points = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
      points.push(`${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`);
    }
    return points.join(' ');
  }

  function update(time: number) {
    if (time - lastUpdate > 1000) {
      sides = (sides % 6) + 3; // 3 to 8
      lastUpdate = time;
    }
    game.isValid = sides === targetSides;
    animationFrame = requestAnimationFrame(update);
  }

  function generate() {
     targetSides = Math.floor(Math.random() * 6) + 3;
  }

  onMount(() => {
    generate();
    animationFrame = requestAnimationFrame(update);
  });

  onDestroy(() => {
    cancelAnimationFrame(animationFrame);
  });
</script>

<div class="shape-shift">
  <svg viewBox="0 0 100 100" width="120" height="120">
    <polygon 
      points={getPoints(sides, 40)} 
      fill="transparent" 
      stroke="var(--neon-green)" 
      stroke-width="3"
    />
  </svg>
  <div class="target neon-text-green">{names[targetSides]}?</div>
</div>

<style>
  .shape-shift {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .target {
    font-size: 1.5rem;
    font-weight: bold;
  }
</style>
