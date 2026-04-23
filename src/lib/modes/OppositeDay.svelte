<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/stores/game.svelte';

  const antonyms = [
    ['Hot', 'Cold'],
    ['Big', 'Small'],
    ['Up', 'Down'],
    ['Left', 'Right'],
    ['Fast', 'Slow'],
    ['Light', 'Dark'],
    ['Happy', 'Sad'],
    ['Hard', 'Soft'],
    ['Yes', 'No'],
    ['Black', 'White']
  ];

  const words = ['Hot', 'Cold', 'Big', 'Small', 'Up', 'Down', 'Fast', 'Slow', 'Light', 'Dark'];

  let wordA = $state('');
  let wordB = $state('');

  function generate() {
    const isOpposite = Math.random() > 0.5;
    
    if (isOpposite) {
      const pair = antonyms[Math.floor(Math.random() * antonyms.length)];
      wordA = pair[0];
      wordB = pair[1];
    } else {
      wordA = words[Math.floor(Math.random() * words.length)];
      wordB = words[Math.floor(Math.random() * words.length)];
      // Ensure they aren't accidentally antonyms
      while (antonyms.some(p => (p[0] === wordA && p[1] === wordB) || (p[1] === wordA && p[0] === wordB))) {
         wordB = words[Math.floor(Math.random() * words.length)];
      }
    }
    
    game.isValid = antonyms.some(p => 
      (p[0] === wordA && p[1] === wordB) || (p[1] === wordA && p[0] === wordB)
    );
  }

  onMount(() => {
    generate();
  });
</script>

<div class="opposite-day">
  <div class="word neon-text-pink">{wordA}</div>
  <div class="vs">vs</div>
  <div class="word neon-text-blue">{wordB}</div>
</div>

<style>
  .opposite-day {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }

  .word {
    font-size: 2.5rem;
    font-weight: 900;
  }

  .vs {
    font-size: 1rem;
    color: var(--text-dim);
    font-style: italic;
  }
</style>
