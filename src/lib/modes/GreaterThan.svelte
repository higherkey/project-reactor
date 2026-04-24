<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/stores/game.svelte';

  let eq1 = $state('');
  let eq2 = $state('');
  // symbol shown: either '>' or '<'. isValid = true if the symbol correctly
  // represents the relationship between the two expressions.
  let symbol = $state('>');

  function generate() {
    let a: number, b: number, c: number, d: number;
    let v1: number, v2: number;
    // Regenerate until values are not equal (eliminates ambiguous draws)
    do {
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      c = Math.floor(Math.random() * 10) + 1;
      d = Math.floor(Math.random() * 10) + 1;
      v1 = a + b;
      v2 = c + d;
    } while (v1 === v2);

    eq1 = `${a} + ${b}`;
    eq2 = `${c} + ${d}`;

    // Randomly pick which symbol to show — the challenge is judging if it's correct
    symbol = Math.random() > 0.5 ? '>' : '<';
    const actuallyGreater = v1 > v2;
    game.isValid = (symbol === '>' && actuallyGreater) || (symbol === '<' && !actuallyGreater);
  }

  onMount(() => {
    generate();
  });
</script>

<div class="greater-than">
  <div class="side neon-text-pink">{eq1}</div>
  <div class="symbol">{symbol}</div>
  <div class="side neon-text-blue">{eq2}</div>
</div>

<style>
  .greater-than {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .side {
    font-size: 2rem;
    font-weight: 800;
  }

  .symbol {
    font-size: 3rem;
    font-weight: 900;
    color: white;
  }
</style>
