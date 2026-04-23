<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/stores/game';

  const directions = [
    { name: 'LEFT', rotation: 180 },
    { name: 'RIGHT', rotation: 0 },
    { name: 'UP', rotation: 270 },
    { name: 'DOWN', rotation: 90 }
  ];

  let textDir = $state('');
  let arrowRotation = $state(0);

  function generate() {
    const textIdx = Math.floor(Math.random() * directions.length);
    const arrowIdx = Math.floor(Math.random() * directions.length);
    
    textDir = directions[textIdx].name;
    arrowRotation = directions[arrowIdx].rotation;
    
    game.isValid = textIdx === arrowIdx;
  }

  onMount(() => {
    generate();
  });
</script>

<div class="directional">
  <div class="text neon-text-yellow">{textDir}</div>
  <div class="arrow" style="transform: rotate({arrowRotation}deg)">
    <svg viewBox="0 0 24 24" width="80" height="80">
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="white" />
    </svg>
  </div>
</div>

<style>
  .directional {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .text {
    font-size: 3rem;
    font-weight: 900;
    letter-spacing: 4px;
  }

  .arrow {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
