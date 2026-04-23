<script lang="ts">
  import { game } from '$lib/stores/game';
  import { onMount } from 'svelte';

  interface Props {
    index: number;
    color: 'blue' | 'pink' | 'green' | 'yellow';
    rotation: number;
  }

  let { index, color, rotation }: Props = $props();
  let isLocked = $state(false);

  function handleTap(e: PointerEvent) {
    if (isLocked || game.gameState !== 'active') return;

    const before = game.scores[index];
    game.addPoint(index);
    
    if (game.scores[index] < before) {
      triggerLockout();
    }
  }

  function triggerLockout() {
    isLocked = true;
    setTimeout(() => {
      isLocked = false;
    }, 2000);
  }
</script>

<div 
  class="quadrant glass neon-border-{color} {isLocked ? 'locked' : ''}"
  style="transform: rotate({rotation}deg);"
  onpointerdown={handleTap}
>
  <div class="score neon-text-{color}">{game.scores[index]}</div>
  <div class="player-label">P{index + 1}</div>
  
  {#if isLocked}
    <div class="lockout-overlay">LOCKOUT</div>
  {/if}
</div>

<style>
  .quadrant {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
    overflow: hidden;
  }

  .quadrant:active {
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(var(--rot)) scale(0.98) !important;
  }

  .score {
    font-size: 4rem;
    font-weight: 800;
    font-family: var(--font-mono);
  }

  .player-label {
    font-size: 0.8rem;
    opacity: 0.5;
    margin-top: 10px;
    letter-spacing: 2px;
  }

  .locked {
    filter: grayscale(1) opacity(0.5);
    pointer-events: none;
  }

  .lockout-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--neon-red);
    font-weight: 900;
    font-size: 1.5rem;
    animation: flash 0.5s infinite alternate;
  }

  @keyframes flash {
    from { opacity: 0.5; }
    to { opacity: 1; }
  }
</style>
