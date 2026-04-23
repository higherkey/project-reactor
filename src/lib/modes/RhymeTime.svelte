<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/stores/game.svelte';

  const rhymes = [
    ['Cat', 'Hat'],
    ['Blue', 'Glue'],
    ['Sun', 'Fun'],
    ['Right', 'Night'],
    ['Fly', 'Sky'],
    ['Tree', 'Bee'],
    ['Bear', 'Chair']
  ];

  const others = ['Dog', 'Fish', 'Bird', 'Moon', 'Star', 'Cloud', 'Water'];

  let wordA = $state('');
  let wordB = $state('');

  function generate() {
    const isRhyme = Math.random() > 0.5;
    if (isRhyme) {
      const pair = rhymes[Math.floor(Math.random() * rhymes.length)];
      wordA = pair[0];
      wordB = pair[1];
    } else {
      wordA = rhymes[Math.floor(Math.random() * rhymes.length)][0];
      wordB = others[Math.floor(Math.random() * others.length)];
    }
    
    game.isValid = rhymes.some(p => (p[0] === wordA && p[1] === wordB) || (p[1] === wordA && p[0] === wordB));
  }

  onMount(() => {
    generate();
  });
</script>

<div class="rhyme-time">
  <div class="word neon-text-pink">{wordA}</div>
  <div class="amp">&</div>
  <div class="word neon-text-blue">{wordB}</div>
  <div class="hint">RHYME?</div>
</div>

<style>
  .rhyme-time {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .word {
    font-size: 2.5rem;
    font-weight: 900;
  }

  .amp {
    font-size: 1rem;
    color: var(--text-dim);
  }

  .hint {
    margin-top: 10px;
    font-size: 0.8rem;
    letter-spacing: 2px;
    color: var(--text-dim);
  }
</style>
