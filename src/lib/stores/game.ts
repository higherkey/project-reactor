import { type Component } from 'svelte';

export type GameState = 'waiting' | 'active' | 'roundOver' | 'gameOver';

export interface GameMode {
  id: string;
  name: string;
  component: any;
}

class GameEngine {
  scores = $state([0, 0, 0, 0]);
  gameState = $state<GameState>('waiting');
  targetScore = $state(10);
  currentMode = $state<GameMode | null>(null);
  winner = $state<number | null>(null);
  isValid = $state(false); // New: global validation state for current instruction

  addPoint(playerIndex: number) {
    if (this.gameState !== 'active') return;
    
    if (this.isValid) {
      this.scores[playerIndex]++;
      if (this.scores[playerIndex] >= this.targetScore) {
        this.winner = playerIndex;
        this.gameState = 'gameOver';
      } else {
        this.gameState = 'roundOver';
      }
    } else {
      this.penalize(playerIndex);
    }
  }

  penalize(playerIndex: number) {
    if (this.gameState !== 'active') return;
    this.scores[playerIndex] = Math.max(0, this.scores[playerIndex] - 1);
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
