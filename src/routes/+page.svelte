<script lang="ts">
  import { game } from '$lib/stores/game.svelte';
  import Quadrant from '$lib/components/Quadrant.svelte';
  import InstructionArea from '$lib/components/InstructionArea.svelte';
  import SettingsOverlay from '$lib/components/SettingsOverlay.svelte';

  let showSettings = $state(false);

  function handleKeydown(e: KeyboardEvent) {
    if (showSettings) return;
    // Escape opens settings when not in a game
    if (e.key === 'Escape' && game.gameState === 'waiting') {
      showSettings = true;
      return;
    }
    if (game.gameState !== 'active') return;
    const index = game.playerKeys.findIndex(k => k.toLowerCase() === e.key.toLowerCase());
    if (index !== -1) {
      e.preventDefault();
      game.addPoint(index);
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<main class="game-container">
  <div class="corner top-left">
    <Quadrant index={0} color="blue" />
  </div>
  <div class="corner top-right">
    <Quadrant index={1} color="pink" />
  </div>
  <div class="corner bottom-left">
    <Quadrant index={2} color="green" />
  </div>
  <div class="corner bottom-right">
    <Quadrant index={3} color="yellow" />
  </div>

  <!-- Permanent settings gear — always visible in center -->
  <button
    class="settings-gear"
    onpointerdown={() => showSettings = true}
    aria-label="Open settings"
  >⚙</button>

  <!-- Center display: InstructionArea sits above the gear -->
  <div class="center-layer">
    <InstructionArea />
  </div>

  <SettingsOverlay bind:show={showSettings} />
</main>

<style>
  /*
   * Layout approach:
   * - Use CSS Grid for the 2x2 quadrant layout (fills the whole viewport)
   * - Center area overlays the grid
   */
  .game-container {
    position: fixed;
    inset: 0;
    background: var(--bg-dark);
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }

  /* Subtle animated background glow — doesn't scale any UI elements */
  .game-container::before {
    content: '';
    position: absolute;
    inset: -10%;
    background: radial-gradient(ellipse at center, rgba(0, 242, 255, 0.1) 0%, transparent 75%);
    animation: bgPulse 6s infinite alternate ease-in-out;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes bgPulse {
    0%   { opacity: 0.3; transform: scale(1) rotate(0deg); }
    100% { opacity: 0.8;   transform: scale(1.3) rotate(5deg); }
  }

  /* Corners: fill their grid cell */
  .corner {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2;
  }

  /* Grid placement */
  .top-left     { grid-column: 1; grid-row: 1; }
  .top-right    { grid-column: 2; grid-row: 1; }
  .bottom-left  { grid-column: 1; grid-row: 2; }
  .bottom-right { grid-column: 2; grid-row: 2; }

  /* Center display area — overlays the grid */
  .center-layer {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    z-index: 10;
    pointer-events: none;
    padding: 20px;
  }

  /* Settings gear — positioned at top-left of center area */
  .settings-gear {
    position: absolute;
    z-index: 20;
    font-size: 2rem;
    width: 44px;
    height: 44px;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: auto;
    /* Position near center but out of the way */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translateY(-100px);
  }

  .settings-gear:hover {
    color: var(--neon-blue);
    filter: drop-shadow(0 0 8px var(--neon-blue));
  }

  /* On landscape, move gear to the side */
  @media (orientation: landscape) {
    .settings-gear {
      transform: translate(-50%, -50%) translateX(-200px);
    }
  }

  /* Mobile/Portrait: position gear above the instruction box */
  @media (max-width: 600px) {
    .settings-gear {
      transform: translate(-50%, -50%) translateY(-120px);
    }
  }
</style>
