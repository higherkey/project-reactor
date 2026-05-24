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
    { id: 'color-match', name: 'Color Match', component: ColorMatch, description: 'Tap if color name matches text color!', category: 'speed' },
    { id: 'quick-math', name: 'Quick Math', component: QuickMath, description: 'Tap if the equation is correct!', category: 'logic' },
    { id: 'odd-one-out', name: 'Odd One Out', component: OddOneOut, description: 'Tap if one symbol is different!', category: 'visual' },
    { id: 'growing-pains', name: 'Growing Pains', component: GrowingPains, description: 'Tap when the circle touches the edge!', category: 'speed' },
    { id: 'opposite-day', name: 'Opposite Day', component: OppositeDay, description: 'Tap if the words are antonyms!', category: 'knowledge' },
    { id: 'symmetry-check', name: 'Symmetry Check', component: SymmetryCheck, description: 'Tap if the grids are symmetrical!', category: 'logic' },
    { id: 'prime-pursuit', name: 'Prime Pursuit', component: PrimePursuit, description: 'Tap if the number is prime!', category: 'knowledge' },
    { id: 'shape-shift', name: 'Shape Shift', component: ShapeShift, description: 'Tap if sides match the target!', category: 'visual' },
    { id: 'flash-count', name: 'Flash Count', component: FlashCount, description: 'Tap if the number of dots was EVEN!', category: 'speed' },
    { id: 'clock-watch', name: 'Clock Watch', component: ClockWatch, description: 'Tap if digital matches analog!', category: 'knowledge' },
    { id: 'greater-than', name: 'Greater Than', component: GreaterThan, description: 'Tap if the left side is GREATER!', category: 'logic' },
    { id: 'directional', name: 'Directional', component: Directional, description: 'Tap if arrow points in text direction!', category: 'speed' },
    { id: 'flag-finder', name: 'Flag Finder', component: FlagFinder, description: 'Tap if name matches the flag!', category: 'knowledge' },
    { id: 'grid-fill', name: 'Grid Fill', component: GridFill, description: 'Tap when the grid is FULL!', category: 'logic' },
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

<div class="instruction-container">
  {#if confirmAction}
    <div class="confirmation-overlay">
      <p>Are you sure you want to {confirmAction}?</p>
      <div class="confirm-btns">
        <button class="confirm-btn yes" onpointerdown={handleConfirm}>YES</button>
        <button class="confirm-btn no" onpointerdown={() => confirmAction = null}>NO</button>
      </div>
    </div>
  {/if}

  {#if game.gameState === 'waiting'}
    <!-- Mirrored title for top players -->
    <div class="message neon-text-blue mirrored">PROJECT REACTOR</div>
    <button class="start-btn neon-border-green" onpointerdown={nextRound}>START GAME</button>
    <!-- Normal title for bottom players -->
    <div class="message neon-text-blue">PROJECT REACTOR</div>
  {:else if game.gameState === 'active' && game.currentMode}
    {@const ModeComp = game.currentMode.component}
    <div class="mode-display">
      <!-- Top instruction panel (rotated 180 for top players) -->
      <div class="mode-info mirrored">
        <span class="mode-name">{game.currentMode.name}</span>
        <p class="mode-description">{(game.currentMode as any).description}</p>
        {#if game.roundTimeLimit > 0}
          <div class="timer {timeLeft <= 3 ? 'danger' : ''}">{timeLeft}s</div>
        {/if}
      </div>

      <!-- Center game content -->
      <div class="mode-content">
        <ModeComp />
      </div>
      
      <!-- Bottom instruction panel (normal orientation for bottom players) -->
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
    <div class="message neon-text-green mirrored">BINGO!</div>
    <div class="auto-start">Next round in {autoStartLeft}s...</div>
    <button class="start-btn neon-border-blue" onpointerdown={nextRound}>START NOW</button>
    <div class="message neon-text-green">BINGO!</div>
  {:else if game.gameState === 'gameOver'}
    {#if game.winner !== null}
      <div class="message neon-text-yellow mirrored">
        {game.teamMode !== 'ffa' ? 'TEAM' : 'PLAYER'} {game.winner + 1} WINS!
      </div>
      <button class="start-btn neon-border-blue" onpointerdown={() => game.reset()}>RESET</button>
      <div class="message neon-text-yellow">
        {game.teamMode !== 'ffa' ? 'TEAM' : 'PLAYER'} {game.winner + 1} WINS!
      </div>
    {:else}
      <div class="message neon-text-yellow mirrored">IT&apos;S A DRAW!</div>
      <button class="start-btn neon-border-blue" onpointerdown={() => game.reset()}>RESET</button>
      <div class="message neon-text-yellow">IT&apos;S A DRAW!</div>
    {/if}
  {/if}
</div>

<style>
  .instruction-container {
    position: relative;
    width: 100%;
    max-width: 600px;
    height: auto;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 24px 40px;
    gap: 16px;
    pointer-events: auto;
    z-index: 100;
    border-radius: 20px;
    background: #0a0a0c;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.8), 0 0 80px rgba(0, 242, 255, 0.1);
  }

  .mirrored {
    transform: rotate(180deg);
  }

  .confirmation-overlay {
    position: absolute;
    inset: 0;
    z-index: 200;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(10, 10, 12, 0.98);
    border-radius: 20px;
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
    gap: 12px;
  }

  .mode-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    width: 100%;
  }

  .mode-content {
    padding: 12px 0;
  }

  .mode-name {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--neon-blue);
    white-space: nowrap;
  }

  .mode-description {
    font-size: 0.95rem;
    color: var(--text-main);
    opacity: 0.9;
    margin: 0;
  }

  .timer {
    font-size: 1rem;
    font-weight: 900;
    color: var(--neon-blue);
    font-family: var(--font-mono);
    padding: 2px 10px;
    background: rgba(0, 242, 255, 0.1);
    border-radius: 6px;
  }

  .timer.danger {
    color: var(--neon-red);
    background: rgba(255, 49, 49, 0.15);
    animation: flash 0.5s infinite alternate;
  }

  @keyframes flash {
    from { opacity: 0.5; }
    to { opacity: 1; }
  }

  .message {
    font-size: 1.8rem;
    font-weight: 900;
    letter-spacing: -1px;
    line-height: 1.1;
  }

  .auto-start {
    font-size: 0.9rem;
    color: var(--text-dim);
    font-family: var(--font-mono);
  }

  .start-btn {
    padding: 14px 28px;
    background: rgba(255, 255, 255, 0.08);
    color: white;
    font-size: 1rem;
    font-weight: 900;
    letter-spacing: 2px;
    border: 2px solid var(--neon-blue);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .start-btn:hover {
    background: rgba(0, 242, 255, 0.15);
  }

  .game-controls {
    display: flex;
    gap: 10px;
    margin-top: 8px;
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
