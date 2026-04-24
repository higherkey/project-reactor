<script lang="ts">
  import { game, type GameMode } from '$lib/stores/game.svelte';

  let { show = $bindable(false) } = $props();

  const categories = [
    { id: 'logic', name: 'Logic', modes: ['quick-math', 'symmetry-check', 'prime-pursuit', 'greater-than', 'grid-fill'] },
    { id: 'speed', name: 'Speed', modes: ['color-match', 'growing-pains', 'flash-count', 'directional'] },
    { id: 'knowledge', name: 'Knowledge', modes: ['opposite-day', 'clock-watch', 'flag-finder', 'rhyme-time'] },
    { id: 'visual', name: 'Visual', modes: ['odd-one-out', 'shape-shift'] }
  ];

  const modeNames: Record<string, string> = {
    'color-match': 'Color Match',
    'quick-math': 'Quick Math',
    'odd-one-out': 'Odd One Out',
    'growing-pains': 'Growing Pains',
    'opposite-day': 'Opposite Day',
    'symmetry-check': 'Symmetry Check',
    'prime-pursuit': 'Prime Pursuit',
    'shape-shift': 'Shape Shift',
    'flash-count': 'Flash Count',
    'clock-watch': 'Clock Watch',
    'greater-than': 'Greater Than',
    'directional': 'Directional',
    'flag-finder': 'Flag Finder',
    'grid-fill': 'Grid Fill',
    'rhyme-time': 'Rhyme Time'
  };

  function close() {
    show = false;
    game.saveSettings();
  }

  function toggleCategory(categoryModes: string[], enable: boolean) {
    if (enable) {
      const newIds = new Set([...game.enabledModeIds, ...categoryModes]);
      game.enabledModeIds = Array.from(newIds);
    } else {
      game.enabledModeIds = game.enabledModeIds.filter(id => !categoryModes.includes(id));
    }
    game.saveSettings();
  }

  function toggleAllModes(enable: boolean) {
    if (enable) {
      game.enabledModeIds = Object.keys(modeNames);
    } else {
      game.enabledModeIds = [];
    }
    game.saveSettings();
  }
</script>

{#if show}
  <div class="settings-backdrop" onpointerdown={close} role="presentation">
    <div class="settings-modal glass" onpointerdown={(e) => e.stopPropagation()} role="presentation">
      <div class="header">
        <h2>SETTINGS</h2>
        <button class="close-btn" onpointerdown={close}>×</button>
      </div>

      <div class="section">
        <h3>Presets</h3>
        <div class="preset-buttons">
          <button 
            class="preset-btn {game.difficulty === 'easy' ? 'active neon-border-green' : ''}" 
            onpointerdown={() => game.setDifficulty('easy')}
          >EASY</button>
          <button 
            class="preset-btn {game.difficulty === 'medium' ? 'active neon-border-blue' : ''}" 
            onpointerdown={() => game.setDifficulty('medium')}
          >MEDIUM</button>
          <button 
            class="preset-btn {game.difficulty === 'hard' ? 'active neon-border-pink' : ''}" 
            onpointerdown={() => game.setDifficulty('hard')}
          >HARD</button>
        </div>
      </div>

      <div class="section">
        <h3>Game Rules</h3>
        <div class="control-row">
          <span>Target Score</span>
          <div class="score-control">
            <button onpointerdown={() => { game.targetScore = Math.max(1, game.targetScore - 1); game.saveSettings(); }}>-</button>
            <span class="value">{game.targetScore}</span>
            <button onpointerdown={() => { game.targetScore++; game.saveSettings(); }}>+</button>
          </div>
        </div>
        <div class="control-row">
          <span>Round Timeout</span>
          <div class="score-control">
            <button onpointerdown={() => { game.roundTimeLimit = Math.max(1, game.roundTimeLimit - 1); game.saveSettings(); }}>-</button>
            <span class="value">{game.roundTimeLimit}s</span>
            <button onpointerdown={() => { game.roundTimeLimit = Math.min(10, game.roundTimeLimit + 1); game.saveSettings(); }}>+</button>
          </div>
        </div>
        <div class="control-row">
          <span>Penalty Enabled</span>
          <label class="switch">
            <input type="checkbox" bind:checked={game.penaltyEnabled} onchange={() => game.saveSettings()} />
            <span class="slider round"></span>
          </label>
        </div>
      </div>

      <div class="section">
        <h3>Teams</h3>
        <div class="preset-buttons grid">
          <button 
            class="preset-btn {game.teamMode === 'ffa' ? 'active neon-border-blue' : ''}" 
            onpointerdown={() => game.setTeamMode('ffa')}
          >Free For All</button>
          <button 
            class="preset-btn {game.teamMode === '2v2' && game.teamConfig[0].includes(1) ? 'active neon-border-blue' : ''}" 
            onpointerdown={() => game.setTeamMode('2v2-top-bottom')}
          >2v2 Top/Bottom</button>
          <button 
            class="preset-btn {game.teamMode === '2v2' && game.teamConfig[0].includes(2) ? 'active neon-border-blue' : ''}" 
            onpointerdown={() => game.setTeamMode('2v2-left-right')}
          >2v2 Left/Right</button>
          <button 
            class="preset-btn {game.teamMode === '1v3' ? 'active neon-border-blue' : ''}" 
            onpointerdown={() => game.setTeamMode('1v3')}
          >1 v 3 (P1 vs Rest)</button>
        </div>
      </div>

      <div class="section">
        <div class="modes-header">
          <h3>Game Modes</h3>
          <div class="global-toggles">
            <button class="cat-btn" onpointerdown={() => toggleAllModes(true)}>ALL</button>
            <button class="cat-btn" onpointerdown={() => toggleAllModes(false)}>NONE</button>
          </div>
        </div>
        <div class="categories">
          {#each categories as category}
            <div class="category-group">
              <div class="category-header">
                <span class="category-name">{category.name}</span>
                <div class="category-controls">
                  <button class="cat-btn" onpointerdown={() => toggleCategory(category.modes, true)}>ALL</button>
                  <button class="cat-btn" onpointerdown={() => toggleCategory(category.modes, false)}>NONE</button>
                </div>
              </div>
              <div class="mode-grid">
                {#each category.modes as modeId}
                  <label class="mode-item">
                    <input 
                      type="checkbox" 
                      checked={game.enabledModeIds.includes(modeId)} 
                      onchange={(e) => {
                        const checked = (e.target as HTMLInputElement).checked;
                        if (checked) {
                          game.enabledModeIds = [...game.enabledModeIds, modeId];
                        } else {
                          game.enabledModeIds = game.enabledModeIds.filter(id => id !== modeId);
                        }
                        game.saveSettings();
                      }}
                    />
                    <span>{modeNames[modeId]}</span>
                  </label>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>

    </div>
  </div>
{/if}

<style>
  .settings-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .settings-modal {
    width: 95vw;
    max-width: 520px;
    max-height: 90vh;
    padding: 30px;
    background: rgba(10, 10, 12, 0.95);
    border-radius: 24px;
    border: 1px solid var(--border-glass);
    color: var(--text-main);
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--neon-blue) transparent;
  }

  .header {
    position: sticky;
    top: 0;
    background: inherit;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    border-bottom: 1px solid var(--border-glass);
    padding-bottom: 15px;
  }

  h2 {
    font-size: 1.8rem;
    font-weight: 900;
    color: white;
    letter-spacing: 2px;
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text-dim);
    font-size: 2rem;
    cursor: pointer;
    transition: color 0.2s;
  }
  
  .close-btn:hover {
    color: var(--neon-red);
  }

  .section {
    margin-bottom: 30px;
  }

  h3 {
    font-size: 0.9rem;
    color: var(--text-dim);
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 2px;
    border-left: 3px solid var(--neon-blue);
    padding-left: 10px;
  }

  .modes-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }

  .global-toggles {
    display: flex;
    gap: 8px;
    margin-bottom: 15px;
  }

  .control-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    background: rgba(255, 255, 255, 0.03);
    padding: 10px 15px;
    border-radius: 12px;
  }

  .preset-buttons {
    display: flex;
    gap: 10px;
  }

  .preset-buttons.grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .preset-btn {
    flex: 1;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-glass);
    border-radius: 8px;
    color: white;
    font-size: 0.8rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
  }

  .preset-btn.active {
    background: rgba(0, 242, 255, 0.1);
    color: white;
  }

  .category-group {
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.02);
    padding: 15px;
    border-radius: 16px;
  }

  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .category-name {
    font-weight: 700;
    color: white;
    font-size: 0.95rem;
  }

  .category-controls {
    display: flex;
    gap: 8px;
  }

  .cat-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 0.7rem;
    color: var(--text-dim);
    cursor: pointer;
  }

  .cat-btn:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  .mode-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .mode-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    cursor: pointer;
    padding: 5px;
    border-radius: 6px;
    transition: background 0.2s;
  }

  .mode-item:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .score-control {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .score-control button {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .score-control .value {
    font-size: 1.5rem;
    font-weight: 900;
    font-family: var(--font-mono);
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.1);
    transition: .4s;
    border: 1px solid var(--border-glass);
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: var(--neon-blue);
  }

  input:checked + .slider:before {
    transform: translateX(20px);
  }

  .slider.round {
    border-radius: 24px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>
