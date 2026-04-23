<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/stores/game';

  const colors = [
    { name: 'RED', hex: '#ff3131', var: 'var(--neon-red)' },
    { name: 'BLUE', hex: '#00f2ff', var: 'var(--neon-blue)' },
    { name: 'GREEN', hex: '#39ff14', var: 'var(--neon-green)' },
    { name: 'YELLOW', hex: '#f0f000', var: 'var(--neon-yellow)' },
    { name: 'PINK', hex: '#ff007a', var: 'var(--neon-pink)' }
  ];

  let displayWord = $state('');
  let displayColor = $state('');
  let isCorrect = $state(false);

  function generate() {
    const wordIdx = Math.floor(Math.random() * colors.length);
    const colorIdx = Math.floor(Math.random() * colors.length);
    
    displayWord = colors[wordIdx].name;
    displayColor = colors[colorIdx].var;
    game.isValid = wordIdx === colorIdx;
  }

  onMount(() => {
    generate();
  });
</script>

<div class="color-match">
  <span style="color: {displayColor}">{displayWord}</span>
</div>

<style>
  .color-match {
    font-size: 3rem;
    font-weight: 900;
    letter-spacing: 2px;
  }
</style>
