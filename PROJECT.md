# Project Reactor - Architecture & Roadmap

This document serves as the primary technical specification and implementation roadmap for **Project Reactor**, a high-performance local-multiplayer reaction Progressive Web App (PWA).

## 1. Executive Summary
Project Reactor is a competitive reaction game where the screen is divided into four quadrants (one for each player). A central instruction area displays cognitive challenges; the first player to respond correctly when the condition is met wins a point.

### Core Objectives:
- **Zero Latency**: Sub-16ms response feedback.
- **High Performance**: 60fps animations on mobile hardware.
- **Premium Aesthetics**: "Neon Glass" design system using Vanilla CSS.
- **Accessibility**: Multi-touch support via Pointer Events API.

## 2. Technical Architecture

### Stack
- **Core Framework**: SvelteKit (configured in SPA mode/adapter-static).
- **State Management**: Svelte 5 Runes ($state, $derived, $effect) for high-performance reactivity.
- **Styling**: Vanilla CSS with CSS Variables for theme management and glassmorphism.
- **Input**: Pointer Events API (`pointerdown`) to eliminate mobile tap delays and track concurrent touches.
- **PWA**: Workbox-powered service worker for offline-first capabilities.

### Key Logic Modules
- **Game Engine (`game.ts`)**: Centralized rune-based engine managing scores, game state, and mode cycling.
- **Instruction Generator**: modular system that cycles through a "Deck" of game modes.
- **Quadrant Component**: Handles localized player interaction, orientation, and lockout penalties.

---

## 3. Implementation Roadmap

### Phase 1: Proof of Concept (POC) - [IN PROGRESS]
Focuses on the "Core Loop" and the initial 15 game modes.

#### POC Game Modes (Top 15):
- [x] **Color Match**: Word matches text color.
- [x] **Quick Math**: Simple mathematical statement is true.
- [x] **Odd One Out**: One icon differs from the rest.
- [ ] **Growing Pains**: Central circle touches quadrant boundary.
- [ ] **Opposite Day**: Two words are antonyms.
- [ ] **Symmetry Check**: Mirror image patterns.
- [ ] **Prime Pursuit**: Displayed number is prime.
- [ ] **Shape Shift**: Polygon reaches target side count.
- [ ] **Flash Count**: Brief cluster of dots is even/odd.
- [ ] **Clock Watch**: Analog matches digital time.
- [ ] **Greater Than**: Equation comparison.
- [ ] **Directional**: Arrow matches text direction.
- [ ] **Flag Finder**: Flag matches country name.
- [ ] **Grid Fill**: Final empty tile identification.
- [ ] **Rhyme Time**: Two words rhyme.

### Phase 2: Minimum Viable Product (MVP)
- **50 Game Modes**: Advanced logic, spatial, and knowledge-based modes.
- **Friction Engine**: Penalty system (-1pt and 2s lockout).
- **Dynamic Catch-up**: Scaling hit areas for trailing players.
- **Quadrant Chaos**: Drifting/orbiting hit areas.

---

## 4. Current Work Trace (feat/poc-completion)

### Planned Work
1.  **Mode Implementation**: Complete the remaining 12 POC modes.
2.  **State Refinement**: Ensure the "Lockout" mechanism is robust across all modes.
3.  **UI/UX Polish**: Enhance the "Neon Glass" transitions.

### In Progress Work
- Initializing project documentation (`PROJECT.md`).
- Reviewing current engine performance.

### Completed Work
- [x] SvelteKit SPA setup.
- [x] Core 4-quadrant layout.
- [x] Input handler with `pointerdown`.
- [x] Initial 3 modes (`ColorMatch`, `QuickMath`, `OddOneOut`).
