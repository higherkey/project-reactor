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
    <Quadrant index={0} color="blue" rotation={90} />
  </div>
  <div class="corner top-right">
    <Quadrant index={1} color="pink" rotation={180} />
  </div>
  <div class="corner bottom-left">
    <Quadrant index={2} color="green" rotation={0} />
  </div>
  <div class="corner bottom-right">
    <Quadrant index={3} color="yellow" rotation={270} />
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
   * The key insight for responsive layout:
   * Portrait: short axis = width  → square = 50vw × 50vw, gap is vertical
   * Landscape: short axis = height → square = 50vh × 50vh, gap is horizontal
   * min(50vw, 50vh) covers both without overflow.
   */
  :global(:root) {
    --q-size: min(50vw, 50vh);
  }

  .game-container {
    position: fixed;
    inset: 0;
    background: var(--bg-dark);
    overflow: hidden;
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

  /* Corners: always square, always fit the short edge */
  .corner {
    position: absolute;
    width: var(--q-size);
    height: var(--q-size);
    z-index: 2;
  }

  .top-left     { top: 0;    left: 0;  }
  .top-right    { top: 0;    right: 0; }
  .bottom-left  { bottom: 0; left: 0;  }
  .bottom-right { bottom: 0; right: 0; }

  /* Center display area — positioned between the corner squares */
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
    /* Inset by the quadrant size so content can't overlap corners */
    padding: var(--q-size);
  }

  /* Settings gear — moved to the side, no background */
  .settings-gear {
    position: absolute;
    z-index: 20;
    font-size: 2.2rem;
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
    /* Default: top-right of center area */
    top: calc(50% - 110px);
    right: calc(50% - 280px);
  }

  .settings-gear:hover {
    color: var(--neon-blue);
    filter: drop-shadow(0 0 8px var(--neon-blue));
    transform: rotate(90deg) scale(1.1);
  }

  /* On landscape, keep it next to the instruction box */
  @media (orientation: landscape) {
    .settings-gear {
      top: 50%;
      right: calc(50% - 320px);
      transform: translateY(-50%);
    }
    .settings-gear:hover {
      transform: translateY(-50%) rotate(90deg) scale(1.1);
    }
  }

  /* Mobile/Portrait adjustment: put it below the box if horizontal space is tight */
  @media (max-width: 600px) {
    .settings-gear {
      top: auto;
      bottom: calc(50% - 140px);
      right: 50%;
      transform: translateX(50%);
    }
    .settings-gear:hover {
      transform: translateX(50%) rotate(90deg) scale(1.1);
    }
  }
</style>
