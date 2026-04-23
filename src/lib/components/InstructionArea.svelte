<script lang="ts">
  import { game } from '$lib/stores/game';
  import ColorMatch from '$lib/modes/ColorMatch.svelte';
  import QuickMath from '$lib/modes/QuickMath.svelte';
  import OddOneOut from '$lib/modes/OddOneOut.svelte';

  const modes = [
    { id: 'color-match', name: 'Color Match', component: ColorMatch },
    { id: 'quick-math', name: 'Quick Math', component: QuickMath },
    { id: 'odd-one-out', name: 'Odd One Out', component: OddOneOut }
  ];

  function nextRound() {
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    game.startNextRound(randomMode);
  }
</script>

<div class="instruction-container glass animate-pulse-subtle">
  {#if game.gameState === 'waiting'}
    <div class="message neon-text-blue">PROJECT REACTOR</div>
    <button class="start-btn glass neon-border-green" onpointerdown={nextRound}>START GAME</button>
  {:else if game.gameState === 'active' && game.currentMode}
    <div class="mode-display">
         <svelte:component this={game.currentMode.component} />
    </div>
  {:else if game.gameState === 'roundOver'}
    <div class="message neon-text-green">BINGO!</div>
    <button class="start-btn glass neon-border-blue" onpointerdown={nextRound}>NEXT ROUND</button>
  {:else if game.gameState === 'gameOver'}
    <div class="message neon-text-yellow">WINNER: P{game.winner! + 1}</div>
    <button class="start-btn glass neon-border-blue" onpointerdown={() => game.reset()}>RESET</button>
  {/if}
</div>

<style>
  .instruction-container {
    width: 280px;
    height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20px;
    pointer-events: auto;
    z-index: 100;
  }

  .message {
    font-size: 2rem;
    font-weight: 900;
    margin-bottom: 20px;
  }

  .start-btn {
    padding: 12px 24px;
    background: transparent;
    color: white;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .start-btn:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.1);
  }
</style>
