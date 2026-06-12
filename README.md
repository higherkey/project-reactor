# Project Reactor

> A high-performance, local-multiplayer reaction game built with Svelte 5.

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/richardlitt/standard-readme)
[![Live Demo](https://img.shields.io/badge/Live-Demo-00f2ff?style=flat-square&logo=google-chrome&logoColor=white)](https://higherkey.github.io/project-reactor/)
[![Deploy Status](https://github.com/higherkey/project-reactor/actions/workflows/deploy.yml/badge.svg)](https://github.com/higherkey/project-reactor/actions/workflows/deploy.yml)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-FF3E00?style=flat-square&logo=svelte&logoColor=white)](https://svelte.dev/)
[![SvelteKit 2](https://img.shields.io/badge/SvelteKit-2-FF3E00?style=flat-square&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vite.dev/)
[![TypeScript 6](https://img.shields.io/badge/TypeScript-6-007ACC?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

Project Reactor pits up to four players against each other in a series of cognitive and speed challenges on a single screen. Designed for speed, responsiveness, and clean neon-glass aesthetics.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Background

Players occupy quadrants of the screen. A central instruction area displays a challenge (e.g., "Color Match", "Quick Math"). The first player to tap their quadrant when the condition is met wins a point. Incorrect taps result in penalties and lockouts.

### Key Features
- **4-Player Local Multiplayer**: Optimized for tablets and large-screen mobile devices.
- **15+ High-Speed Game Modes**: Logic, speed, knowledge, and visual challenges.
- **Neon Glass Aesthetic**: A premium "Neon Glass" design system using Vanilla CSS glassmorphism and vibrant gradients.
- **Zero Latency**: Powered by Svelte 5 Runes and the Pointer Events API for sub-16ms response feedback.
- **PWA Ready**: Built as a Progressive Web App for offline play and home screen installation.
- **Flexible Rules**: Customize target scores, round timeouts, and team configurations (FFA, 2v2, 1v3).

### Tech Stack Details
- **Framework**: [Svelte 5](https://svelte.dev/) & [SvelteKit](https://kit.svelte.dev/) (using Svelte Runes: `$state`, `$derived`, `$effect`).
- **Build Engine**: Vite 8 & TypeScript 6.
- **Styling**: Vanilla CSS with CSS Variables for dynamic theming.
- **Deployment**: Static adapter for GitHub Pages / PWA hosting.

---

## Install

### Prerequisites
- [Node.js](https://nodejs.org/) (latest LTS recommended)
- npm

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/higherkey/project-reactor.git
   cd project-reactor
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## Usage

### Local Development
To launch the hot-reloaded development server locally:
```bash
npm run dev
```

### Building for Production
To compile the static web application for hosting (outputs to `build/`):
```bash
npm run build
```

---

## Contributing

Please submit code modifications using conventional commits. Ensure all visual additions match the unified neon glass styling paradigm.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
