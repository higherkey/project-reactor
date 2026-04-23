<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/stores/game';

  let eq1 = $state('');
  let eq2 = $state('');
  let val1 = $state(0);
  let val2 = $state(0);

  function generate() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const c = Math.floor(Math.random() * 10) + 1;
    const d = Math.floor(Math.random() * 10) + 1;
    
    eq1 = `${a} + ${b}`;
    eq2 = `${c} + ${d}`;
    val1 = a + b;
    val2 = c + d;
    
    game.isValid = val1 > val2;
  }

  onMount(() => {
    generate();
  });
</script>

<div class="greater-than">
  <div class="side neon-text-pink">{eq1}</div>
  <div class="symbol">></div>
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
