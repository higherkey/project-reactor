<script lang="ts">
  import { game } from '$lib/stores/game.svelte';
  import ColorMatch from '$lib/modes/ColorMatch.svelte';
  import QuickMath from '$lib/modes/QuickMath.svelte';
  import OddOneOut from '$lib/modes/OddOneOut.svelte';
  import GrowingPains from '$lib/modes/GrowingPains.svelte';
  import OppositeDay from '$lib/modes/OppositeDay.svelte';
  import SymmetryCheck from '$lib/modes/SymmetryCheck.svelte';
  import PrimePursuit from '$lib/modes/PrimePursuit.svelte';
  import ShapeShift from '$lib/modes/ShapeShift.svelte';
  import FlashCount from '$lib/modes/FlashCount.svelte';
  import ClockWatch from '$lib/modes/ClockWatch.svelte';
  import GreaterThan from '$lib/modes/GreaterThan.svelte';
  import Directional from '$lib/modes/Directional.svelte';
  import FlagFinder from '$lib/modes/FlagFinder.svelte';
  import GridFill from '$lib/modes/GridFill.svelte';
  import RhymeTime from '$lib/modes/RhymeTime.svelte';

  const modes = [
    { id: 'color-match', name: 'Color Match', component: ColorMatch },
    { id: 'quick-math', name: 'Quick Math', component: QuickMath },
    { id: 'odd-one-out', name: 'Odd One Out', component: OddOneOut },
    { id: 'growing-pains', name: 'Growing Pains', component: GrowingPains },
    { id: 'opposite-day', name: 'Opposite Day', component: OppositeDay },
    { id: 'symmetry-check', name: 'Symmetry Check', component: SymmetryCheck },
    { id: 'prime-pursuit', name: 'Prime Pursuit', component: PrimePursuit },
    { id: 'shape-shift', name: 'Shape Shift', component: ShapeShift },
    { id: 'flash-count', name: 'Flash Count', component: FlashCount },
    { id: 'clock-watch', name: 'Clock Watch', component: ClockWatch },
    { id: 'greater-than', name: 'Greater Than', component: GreaterThan },
    { id: 'directional', name: 'Directional', component: Directional },
    { id: 'flag-finder', name: 'Flag Finder', component: FlagFinder },
    { id: 'grid-fill', name: 'Grid Fill', component: GridFill },
    { id: 'rhyme-time', name: 'Rhyme Time', component: RhymeTime }
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
    {@const ModeComp = game.currentMode.component}
    <div class="mode-display">
         <ModeComp />
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
