# Project Reactor ⚡

**Project Reactor** is a high-performance, local-multiplayer reaction game built with **Svelte 5**. Designed for speed and style, it pits up to four players against each other in a series of cognitive challenges on a single screen.

[![Live Demo](https://img.shields.io/badge/Live-Demo-00f2ff?style=for-the-badge&logo=google-chrome&logoColor=white)](https://higherkey.github.io/project-reactor/)
[![Brand Assets](https://img.shields.io/badge/Brand-Assets-ff007a?style=for-the-badge&logo=adobe-creative-cloud&logoColor=white)](https://higherkey.github.io/project-reactor/brand)

![Project Reactor Banner](https://img.shields.io/badge/Project-Reactor-00f2ff?style=for-the-badge&logo=svelte)

## 🎯 Game Concept
Players occupy quadrants of the screen. A central instruction area displays a challenge (e.g., "Color Match", "Quick Math"). The first player to tap their quadrant when the condition is met wins a point. Incorrect taps result in penalties and lockouts.

## ✨ Key Features
- **4-Player Local Multiplayer**: Optimized for tablets and large-screen mobile devices.
- **15+ High-Speed Game Modes**: Logic, speed, knowledge, and visual challenges.
- **Neon Glass Aesthetic**: A premium "Neon Glass" design system using Vanilla CSS glassmorphism and vibrant gradients.
- **Zero Latency**: Powered by Svelte 5 Runes and the Pointer Events API for sub-16ms response feedback.
- **PWA Ready**: Built as a Progressive Web App for offline play and home screen installation.
- **Flexible Rules**: Customize target scores, round timeouts, and team configurations (FFA, 2v2, 1v3).

## 🛠️ Tech Stack
- **Framework**: [Svelte 5](https://svelte.dev/) & [SvelteKit](https://kit.svelte.dev/)
- **Styling**: Vanilla CSS with CSS Variables for dynamic theming
- **State**: Svelte Runes (`$state`, `$derived`, `$effect`)
- **Deployment**: Static adapter for GitHub Pages / PWA hosting

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (latest LTS recommended)
- `npm` or `pnpm`

### Installation
```bash
git clone https://github.com/[your-username]/project-reactor.git
cd project-reactor
npm install
```

### Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```
The build output will be in the `build/` directory, ready for static hosting.

## 📜 License
MIT
