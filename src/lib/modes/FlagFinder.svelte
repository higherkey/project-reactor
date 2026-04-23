<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/stores/game.svelte';

  const flags = [
    { country: 'USA', emoji: '🇺🇸' },
    { country: 'UK', emoji: '🇬🇧' },
    { country: 'Japan', emoji: '🇯🇵' },
    { country: 'Germany', emoji: '🇩🇪' },
    { country: 'France', emoji: '🇫🇷' },
    { country: 'Canada', emoji: '🇨🇦' },
    { country: 'Brazil', emoji: '🇧🇷' }
  ];

  let countryName = $state('');
  let flagEmoji = $state('');

  function generate() {
    const cIdx = Math.floor(Math.random() * flags.length);
    const fIdx = Math.random() > 0.5 ? cIdx : Math.floor(Math.random() * flags.length);
    
    countryName = flags[cIdx].country;
    flagEmoji = flags[fIdx].emoji;
    
    game.isValid = cIdx === fIdx;
  }

  onMount(() => {
    generate();
  });
</script>

<div class="flag-finder">
  <div class="country neon-text-blue">{countryName}</div>
  <div class="flag">{flagEmoji}</div>
</div>

<style>
  .flag-finder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .country {
    font-size: 2.5rem;
    font-weight: 900;
  }

  .flag {
    font-size: 5rem;
  }
</style>
