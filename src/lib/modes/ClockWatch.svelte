<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/stores/game.svelte';

  let hour = $state(0);
  let minute = $state(0);
  let digitalTime = $state('');

  function generate() {
    hour = Math.floor(Math.random() * 12);
    minute = Math.floor(Math.random() * 12) * 5; // 0, 5, 10... 55
    
    const isCorrect = Math.random() > 0.5;
    
    if (isCorrect) {
      digitalTime = `${hour === 0 ? 12 : hour}:${minute.toString().padStart(2, '0')}`;
    } else {
      let h2: number, m2: number;
      do {
        h2 = Math.floor(Math.random() * 12);
        m2 = Math.floor(Math.random() * 12) * 5;
      } while (h2 === hour && m2 === minute);
      digitalTime = `${h2 === 0 ? 12 : h2}:${m2.toString().padStart(2, '0')}`;
    }
    
    game.isValid = isCorrect;
  }

  onMount(() => {
    generate();
  });
</script>

<div class="clock-watch">
  <svg viewBox="0 0 100 100" width="120" height="120">
    <!-- Face -->
    <circle cx="50" cy="50" r="45" fill="none" stroke="white" stroke-width="2" />
    <!-- Hour Hand -->
    <line 
      x1="50" y1="50" 
      x2={50 + 25 * Math.cos((hour + minute/60) * Math.PI/6 - Math.PI/2)} 
      y2={50 + 25 * Math.sin((hour + minute/60) * Math.PI/6 - Math.PI/2)} 
      stroke="var(--neon-blue)" stroke-width="4" stroke-linecap="round"
    />
    <!-- Minute Hand -->
    <line 
      x1="50" y1="50" 
      x2={50 + 35 * Math.cos(minute * Math.PI/30 - Math.PI/2)} 
      y2={50 + 35 * Math.sin(minute * Math.PI/30 - Math.PI/2)} 
      stroke="white" stroke-width="2" stroke-linecap="round"
    />
  </svg>
  <div class="digital neon-text-blue">{digitalTime}</div>
</div>

<style>
  .clock-watch {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .digital {
    font-size: 2.5rem;
    font-weight: 900;
    font-family: var(--font-mono);
  }
</style>
