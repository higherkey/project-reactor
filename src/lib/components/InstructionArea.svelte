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

  import { onMount, onDestroy } from 'svelte';
  import type { GameMode } from '$lib/stores/game.svelte';

  const modes: GameMode[] = [
    { id: 'color-match', name: 'Color Match', component: ColorMatch, description: 'Tap if word matches its color!', category: 'speed' },
    { id: 'quick-math', name: 'Quick Math', component: QuickMath, description: 'Tap if the equation is correct!', category: 'logic' },
    { id: 'odd-one-out', name: 'Odd One Out', component: OddOneOut, description: 'Tap if one symbol is different!', category: 'visual' },
    { id: 'growing-pains', name: 'Growing Pains', component: GrowingPains, description: 'Tap when the circle hits the edge!', category: 'speed' },
    { id: 'opposite-day', name: 'Opposite Day', component: OppositeDay, description: 'Tap if the words are opposites!', category: 'knowledge' },
    { id: 'symmetry-check', name: 'Symmetry Check', component: SymmetryCheck, description: 'Tap if the patterns mirror!', category: 'logic' },
    { id: 'prime-pursuit', name: 'Prime Pursuit', component: PrimePursuit, description: 'Tap if the number is prime!', category: 'knowledge' },
    { id: 'shape-shift', name: 'Shape Shift', component: ShapeShift, description: 'Tap when the shape matches!', category: 'visual' },
    { id: 'flash-count', name: 'Flash Count', component: FlashCount, description: 'Tap if the dot count was even!', category: 'speed' },
    { id: 'clock-watch', name: 'Clock Watch', component: ClockWatch, description: 'Tap if the times match!', category: 'knowledge' },
    { id: 'greater-than', name: 'Greater Than', component: GreaterThan, description: 'Tap if the comparison is true!', category: 'logic' },
    { id: 'directional', name: 'Directional', component: Directional, description: 'Tap if arrow matches the word!', category: 'speed' },
    { id: 'flag-finder', name: 'Flag Finder', component: FlagFinder, description: 'Tap if flag matches the name!', category: 'knowledge' },
    { id: 'grid-fill', name: 'Grid Fill', component: GridFill, description: 'Tap when the grid is full!', category: 'logic' },
    { id: 'rhyme-time', name: 'Rhyme Time', component: RhymeTime, description: 'Tap if the words rhyme!', category: 'knowledge' }
  ];

  onMount(() => {
    if (game.enabledModeIds.length === 0) {
      game.enabledModeIds = modes.map(m => m.id);
    }
  });

  let timeLeft = $state(0);
  let autoStartLeft = $state(0);
  let timerInterval: any;
  let autoStartInterval: any;
  let confirmAction = $state<null | 'skip' | 'end'>(null);

  function startTimer() {
    if (game.roundTimeLimit <= 0) return;
    timeLeft = game.roundTimeLimit;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        game.gameState = 'roundOver';
      }
    }, 1000);
  }

  function nextRound() {
    const enabledModes = modes.filter(m => game.enabledModeIds.includes(m.id));
    const randomMode = enabledModes[Math.floor(Math.random() * enabledModes.length)] || modes[0];
    game.startNextRound(randomMode);
    startTimer();
  }

  function handleConfirm() {
    if (confirmAction === 'skip') {
      game.skipRound();
    } else if (confirmAction === 'end') {
      game.endGame();
    }
    confirmAction = null;
  }

  $effect(() => {
    if (game.gameState !== 'active') {
      clearInterval(timerInterval);
    }
    if (game.gameState === 'roundOver') {
      autoStartLeft = 3;
      clearInterval(autoStartInterval);
      autoStartInterval = setInterval(() => {
        autoStartLeft--;
        if (autoStartLeft <= 0) {
          clearInterval(autoStartInterval);
          nextRound();
        }
      }, 1000);
    } else {
      clearInterval(autoStartInterval);
    }
  });

  onDestroy(() => {
    clearInterval(timerInterval);
    clearInterval(autoStartInterval);
  });
</script>

<div class="instruction-container glass">
  {#if confirmAction}
    <div class="confirmation-overlay glass">
      <p>Are you sure you want to {confirmAction}?</p>
      <div class="confirm-btns">
        <button class="confirm-btn yes" onpointerdown={handleConfirm}>YES</button>
        <button class="confirm-btn no" onpointerdown={() => confirmAction = null}>NO</button>
      </div>
    </div>
  {/if}

  {#if game.gameState === 'waiting'}
    <div class="message neon-text-blue mirror">PROJECT REACTOR</div>
    <button class="start-btn glass neon-border-green" onpointerdown={nextRound}>START GAME</button>
    <div class="message neon-text-blue">PROJECT REACTOR</div>
  {:else if game.gameState === 'active' && game.currentMode}
    {@const ModeComp = game.currentMode.component}
    <div class="mode-display">
      <div class="mode-info mirror">
        <span class="mode-name">{game.currentMode.name}</span>
        <p class="mode-description">{(game.currentMode as any).description}</p>
        {#if game.roundTimeLimit > 0}
          <div class="timer {timeLeft <= 3 ? 'danger' : ''}">{timeLeft}s</div>
        {/if}
      </div>
      <ModeComp />
      <div class="mode-info">
        <span class="mode-name">{game.currentMode.name}</span>
        <p class="mode-description">{(game.currentMode as any).description}</p>
        {#if game.roundTimeLimit > 0}
          <div class="timer {timeLeft <= 3 ? 'danger' : ''}">{timeLeft}s</div>
        {/if}
      </div>
      
      <div class="game-controls">
        <button class="control-btn skip" onpointerdown={() => confirmAction = 'skip'}>SKIP</button>
        <button class="control-btn end" onpointerdown={() => confirmAction = 'end'}>END GAME</button>
      </div>
    </div>
  {:else if game.gameState === 'roundOver'}
    <div class="message neon-text-green mirror">ROUND OVER</div>
    <div class="auto-start">Next round in {autoStartLeft}s...</div>
    <button class="start-btn glass neon-border-blue" onpointerdown={nextRound}>START NOW</button>
    <div class="message neon-text-green">ROUND OVER</div>
  {:else if game.gameState === 'gameOver'}
    {#if game.winner !== null}
      <div class="message neon-text-yellow mirror">
        {game.teamMode !== 'ffa' ? 'TEAM' : 'PLAYER'} {game.winner + 1} WINS!
      </div>
      <button class="start-btn glass neon-border-blue" onpointerdown={() => game.reset()}>RESET</button>
      <div class="message neon-text-yellow">
        {game.teamMode !== 'ffa' ? 'TEAM' : 'PLAYER'} {game.winner + 1} WINS!
      </div>
    {:else}
      <div class="message neon-text-yellow mirror">IT'S A DRAW!</div>
      <button class="start-btn glass neon-border-blue" onpointerdown={() => game.reset()}>RESET</button>
      <div class="message neon-text-yellow">IT'S A DRAW!</div>
    {/if}
  {/if}
</div>

<style>
  .instruction-container {
    position: relative;
    width: 100%;
    max-width: 480px;
    height: auto;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 28px 32px;
    pointer-events: auto;
    z-index: 100;
    border-radius: 24px;
    background: rgba(10, 10, 12, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 60px rgba(0, 0, 0, 0.5);
  }

  .confirmation-overlay {
    position: absolute;
    inset: 0;
    z-index: 200;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(10, 10, 12, 0.95);
    border-radius: 24px;
    padding: 20px;
  }

  .confirmation-overlay p {
    font-weight: bold;
    margin-bottom: 20px;
    font-size: 1.2rem;
  }

  .confirm-btns {
    display: flex;
    gap: 15px;
  }

  .confirm-btn {
    padding: 10px 25px;
    border-radius: 8px;
    border: 1px solid var(--border-glass);
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s;
  }

  .confirm-btn.yes {
    background: rgba(0, 242, 255, 0.1);
    color: var(--neon-blue);
    border-color: var(--neon-blue);
  }

  .confirm-btn.no {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }

  .mode-display {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .mode-info {
    margin-bottom: 16px;
  }

  .mode-info.mirror {
    margin-bottom: 12px;
    margin-top: 0;
  }

  .mode-name {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--neon-blue);
    display: block;
    margin-bottom: 8px;
  }

  .mode-description {
    font-size: 1rem;
    color: var(--text-dim);
    opacity: 0.8;
  }

  .timer {
    font-size: 1.2rem;
    font-weight: 900;
    color: var(--neon-blue);
    margin-top: 10px;
    font-family: var(--font-mono);
  }

  .timer.danger {
    color: var(--neon-red);
    animation: flash 0.5s infinite alternate;
  }

  @keyframes flash {
    from { opacity: 0.5; }
    to { opacity: 1; }
  }

  .mirror {
    transform: rotate(180deg);
  }

  .message {
    font-size: 2.2rem;
    font-weight: 900;
    margin-bottom: 12px;
    letter-spacing: -1px;
    line-height: 1.1;
  }

  .message.mirror {
    margin-bottom: 0;
    margin-top: 0;
  }

  .auto-start {
    font-size: 0.9rem;
    color: var(--text-dim);
    margin-bottom: 20px;
    font-family: var(--font-mono);
  }

  .start-btn {
    padding: 16px 32px;
    background: rgba(255, 255, 255, 0.05);
    color: white;
    font-size: 1rem;
    font-weight: 900;
    letter-spacing: 2px;
    border: 2px solid var(--neon-blue);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 15px rgba(0, 242, 255, 0.3);
  }

  .game-controls {
    display: flex;
    gap: 10px;
    margin-top: 25px;
  }

  .control-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-glass);
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: bold;
    color: var(--text-dim);
    cursor: pointer;
    transition: all 0.2s;
  }

  .control-btn:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  .control-btn.end:hover {
    border-color: var(--neon-pink);
    color: var(--neon-pink);
  }
</style>
