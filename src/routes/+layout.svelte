<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

{@render children()}

<style>
  :global(body) {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    margin: 0;
    background-color: var(--bg-dark);
  }
</style>
