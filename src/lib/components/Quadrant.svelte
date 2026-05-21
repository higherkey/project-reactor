<script lang="ts">
  import { game } from '$lib/stores/game.svelte';
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    index: number;
    color: 'blue' | 'pink' | 'green' | 'yellow';
  }

  let { index, color }: Props = $props();
  let isLocked = $state(false);
  let isEditingKey = $state(false);

  // Key labels: show nice names for special keys
  function keyLabel(k: string): string {
    const labels: Record<string, string> = {
      'Escape': 'ESC', 'Backspace': '⌫', 'Control': 'CTRL', 'Enter': '↵',
      'Shift': '⇧', 'Alt': 'ALT', 'Tab': 'TAB', ' ': 'SPC'
    };
    return labels[k] ?? k.toUpperCase();
  }

  function handleTap(e: PointerEvent) {
    if (isLocked || game.gameState !== 'active') return;
    const success = game.addPoint(index);
    if (!success) triggerLockout();
  }

  let lockoutTimer: any;

  function triggerLockout() {
    isLocked = true;
    clearTimeout(lockoutTimer);
    lockoutTimer = setTimeout(() => { isLocked = false; }, 2000);
  }

  onDestroy(() => {
    clearTimeout(lockoutTimer);
  });

  function handleKeydown(e: KeyboardEvent) {
    if (isEditingKey) {
      e.preventDefault();
      e.stopPropagation();
      if (e.key !== 'Escape') {
        game.playerKeys[index] = e.key;
        game.saveSettings();
      }
      isEditingKey = false;
    }
  }

  function startEditing(e: PointerEvent) {
    e.stopPropagation();
    isEditingKey = true;
  }

  // Team info
  const teamIndex = $derived(game.teamConfig.findIndex(team => team.includes(index)));
  const isTeamMode = $derived(game.teamMode !== 'ffa');
</script>

<svelte:window onkeydown={handleKeydown} />

<div
  class="quadrant neon-border-{color} {isLocked ? 'locked' : ''}"
  onpointerdown={handleTap}
  role="button"
  tabindex="0"
>
  {#if isTeamMode}
    <div class="team-indicator team-{teamIndex}">
      TEAM {teamIndex === 0 ? 'A' : 'B'}
    </div>
  {/if}

  <div class="content">
    <div class="score neon-text-{color}">{game.scores[index]}</div>
    <div class="player-label">P{index + 1}</div>

    {#if isLocked}
      <div class="lockout-overlay">LOCKOUT</div>
    {/if}

    <!-- Desktop-only key binding hint -->
    <div class="key-hint">
      {#if isEditingKey}
        <span class="key-badge editing">Press a key…</span>
      {:else}
        <span class="key-badge">{keyLabel(game.playerKeys[index])}</span>
        <button class="edit-key" onpointerdown={startEditing} title="Change key">✎</button>
      {/if}
    </div>
  </div>
</div>

<style>
  .quadrant {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    transition: background 0.15s, transform 0.1s;
    touch-action: none;
  }

  .quadrant:active {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(0.96);
  }

  .team-indicator {
    position: absolute;
    top: 15px;
    left: 15px;
    font-size: 0.7rem;
    font-weight: 900;
    padding: 2px 8px;
    border-radius: 4px;
    letter-spacing: 1px;
    z-index: 10;
  }

  .team-0 {
    background: rgba(0, 242, 255, 0.2);
    color: var(--neon-blue);
    border: 1px solid var(--neon-blue);
  }

  .team-1 {
    background: rgba(255, 0, 122, 0.2);
    color: var(--neon-pink);
    border: 1px solid var(--neon-pink);
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 6px;
  }

  .score {
    font-size: clamp(2rem, 6vmin, 4rem);
    font-weight: 800;
    font-family: var(--font-mono);
    line-height: 1;
  }

  .player-label {
    font-size: clamp(0.6rem, 1.5vmin, 0.9rem);
    opacity: 0.45;
    letter-spacing: 3px;
  }

  .locked {
    filter: grayscale(1) brightness(0.4);
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
    font-size: clamp(1rem, 3vmin, 1.8rem);
    letter-spacing: 2px;
    animation: flash 0.5s infinite alternate;
    z-index: 5;
  }

  @keyframes flash {
    from { opacity: 0.5; }
    to   { opacity: 1; }
  }

  /* Key hint: hidden on touch screens, shown on pointer: fine (mouse) */
  .key-hint {
    display: none;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
  }

  .key-badge {
    font-size: 0.75rem;
    font-family: var(--font-mono);
    font-weight: 700;
    color: rgba(255, 255, 255, 0.5);
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 6px;
    padding: 2px 8px;
    letter-spacing: 1px;
  }

  .key-badge.editing {
    color: var(--neon-pink);
    border-color: var(--neon-pink);
    animation: flash 0.8s infinite alternate;
  }

  .edit-key {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    font-size: 0.85rem;
    line-height: 1;
    padding: 2px 4px;
    border-radius: 4px;
    transition: color 0.2s, background 0.2s;
  }

  .edit-key:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  @media (pointer: fine) {
    .key-hint {
      display: flex;
    }
  }
</style>
