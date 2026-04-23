<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/stores/game';

  let number = $state(0);

  function isPrime(num: number) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }

  function generate() {
    // Generate a number between 2 and 50
    number = Math.floor(Math.random() * 49) + 2;
    game.isValid = isPrime(number);
  }

  onMount(() => {
    generate();
  });
</script>

<div class="prime-pursuit">
  <div class="number neon-text-yellow">{number}</div>
  <div class="hint">PRIME?</div>
</div>

<style>
  .prime-pursuit {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .number {
    font-size: 5rem;
    font-weight: 900;
  }

  .hint {
    font-size: 1rem;
    color: var(--text-dim);
    letter-spacing: 4px;
  }
</style>
