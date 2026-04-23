<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/stores/game';

  let equation = $state('');
  
  function generate() {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    const operators = ['+', '-'];
    const op = operators[Math.floor(Math.random() * operators.length)];
    
    let result = op === '+' ? a + b : a - b;
    const isActuallyCorrect = Math.random() > 0.5;
    
    if (!isActuallyCorrect) {
        result += (Math.random() > 0.5 ? 1 : -1);
    }
    
    equation = `${a} ${op} ${b} = ${result}`;
    game.isValid = isActuallyCorrect;
  }

  onMount(() => {
    generate();
  });
</script>

<div class="quick-math neon-text-blue">
  {equation}
</div>

<style>
  .quick-math {
    font-size: 3rem;
    font-weight: 900;
    font-family: var(--font-mono);
  }
</style>
