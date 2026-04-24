import { type Component } from 'svelte';

export type GameState = 'waiting' | 'active' | 'roundOver' | 'gameOver';

export interface GameMode {
  id: string;
  name: string;
  component: any;
  category?: 'logic' | 'speed' | 'knowledge' | 'visual';
  description?: string;
}

class GameEngine {
  // Settings (with persistence)
  targetScore = $state(10);
  penaltyEnabled = $state(false);
  teamMode = $state<'ffa' | '2v2' | '1v3'>('ffa');
  teamConfig = $state<number[][]>([[0], [1], [2], [3]]); 
  enabledModeIds = $state<string[]>([]);
  roundTimeLimit = $state(5); // Default to 5s
  difficulty = $state<'easy' | 'medium' | 'hard'>('medium');
  playerKeys = $state(['Escape', 'Backspace', 'Control', 'Enter']);

  // Game State
  scores = $state([0, 0, 0, 0]);
  
  teamScores = $derived.by(() => {
    return this.teamConfig.map(team => 
      team.reduce((sum, playerIdx) => sum + this.scores[playerIdx], 0)
    );
  });
  
  gameState = $state<GameState>('waiting');
  currentMode = $state<GameMode | null>(null);
  winner = $state<number | null>(null); 
  isValid = $state(false);

  constructor() {
    this.loadSettings();
  }

  saveSettings() {
    if (typeof window === 'undefined') return;
    const settings = {
      targetScore: this.targetScore,
      penaltyEnabled: this.penaltyEnabled,
      teamMode: this.teamMode,
      teamConfig: this.teamConfig,
      enabledModeIds: this.enabledModeIds,
      roundTimeLimit: this.roundTimeLimit,
      difficulty: this.difficulty,
      playerKeys: this.playerKeys
    };
    localStorage.setItem('project_reactor_settings', JSON.stringify(settings));
  }

  loadSettings() {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('project_reactor_settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.targetScore !== undefined) this.targetScore = settings.targetScore;
        if (settings.penaltyEnabled !== undefined) this.penaltyEnabled = settings.penaltyEnabled;
        if (settings.teamMode !== undefined) this.teamMode = settings.teamMode;
        if (settings.teamConfig !== undefined) this.teamConfig = settings.teamConfig;
        if (settings.enabledModeIds !== undefined) this.enabledModeIds = settings.enabledModeIds;
        if (settings.roundTimeLimit !== undefined) {
          // Clamp between 1 and 10
          this.roundTimeLimit = Math.max(1, Math.min(10, settings.roundTimeLimit));
        }
        if (settings.difficulty !== undefined) this.difficulty = settings.difficulty;
        if (settings.playerKeys !== undefined) this.playerKeys = settings.playerKeys;
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }
  }

  addPoint(playerIndex: number): boolean {
    if (this.gameState !== 'active') return false;
    
    if (this.isValid) {
      this.scores[playerIndex]++;
      
      const teamIdx = this.teamConfig.findIndex(team => team.includes(playerIndex));
      const currentTeamScore = this.teamScores[teamIdx];

      if (currentTeamScore >= this.targetScore) {
        this.winner = teamIdx;
        this.gameState = 'gameOver';
      } else {
        this.gameState = 'roundOver';
      }
      return true;
    } else {
      if (this.penaltyEnabled) {
        this.penalize(playerIndex);
      }
      return false;
    }
  }

  setTeamMode(mode: 'ffa' | '2v2-top-bottom' | '2v2-left-right' | '1v3') {
    if (mode === 'ffa') {
      this.teamMode = 'ffa';
      this.teamConfig = [[0], [1], [2], [3]];
    } else if (mode === '2v2-top-bottom') {
      this.teamMode = '2v2';
      this.teamConfig = [[0, 1], [2, 3]]; 
    } else if (mode === '2v2-left-right') {
      this.teamMode = '2v2';
      this.teamConfig = [[0, 2], [1, 3]]; 
    } else if (mode === '1v3') {
      this.teamMode = '1v3';
      this.teamConfig = [[0], [1, 2, 3]]; 
    }
    this.saveSettings();
  }

  penalize(playerIndex: number) {
    this.scores[playerIndex] = Math.max(0, this.scores[playerIndex] - 1);
  }

  static EASY_MODES = ['color-match', 'odd-one-out', 'shape-shift', 'growing-pains', 'flash-count'];
  static MEDIUM_MODES = ['quick-math', 'opposite-day', 'directional', 'grid-fill', 'symmetry-check', 'color-match', 'odd-one-out'];
  static HARD_MODES = ['prime-pursuit', 'clock-watch', 'flag-finder', 'rhyme-time', 'greater-than', 'quick-math', 'symmetry-check'];

  setDifficulty(level: 'easy' | 'medium' | 'hard') {
    this.difficulty = level;
    if (level === 'easy') {
      this.targetScore = 5;
      this.penaltyEnabled = false;
      this.enabledModeIds = [...GameEngine.EASY_MODES];
      this.roundTimeLimit = 7;
    } else if (level === 'medium') {
      this.targetScore = 10;
      this.penaltyEnabled = true;
      this.enabledModeIds = [...GameEngine.MEDIUM_MODES];
      this.roundTimeLimit = 5;
    } else if (level === 'hard') {
      this.targetScore = 15;
      this.penaltyEnabled = true;
      this.enabledModeIds = [...GameEngine.HARD_MODES];
      this.roundTimeLimit = 3;
    }
    this.saveSettings();
  }

  skipRound() {
    this.gameState = 'roundOver';
  }

  endGame() {
    // Find the highest scoring team. If tied at 0, leave winner as null (draw).
    let maxScore = 0;
    let winnerIdx: number | null = null;
    this.teamScores.forEach((score, idx) => {
      if (score > maxScore) {
        maxScore = score;
        winnerIdx = idx;
      }
    });
    this.winner = winnerIdx;
    this.gameState = 'gameOver';
  }

  reset() {
    this.scores = [0, 0, 0, 0];
    this.gameState = 'waiting';
    this.winner = null;
    this.currentMode = null;
  }

  startNextRound(mode: GameMode) {
    this.currentMode = mode;
    this.gameState = 'active';
  }
}

export const game = new GameEngine();
