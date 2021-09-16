<script>
  import { fade, slide } from 'svelte/transition'

  import Tabs from '$lib/ui/Tabs.svelte'
  import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
  import TextField from '$lib/ui/TextField.svelte'
  import { makeValidUrl } from '$lib/utils'
  import config from '../../../stores/config'
  import Hosting from '../Hosting.svelte'

  let tabs = [
    // {
    //   label: 'Profile',
    //   icon: 'home',
    // },
    {
      label: 'Hosting',
      icon: 'server',
    },
    {
      label: 'Advanced',
      icon: 'cog',
    },
  ]
  let activeTab = tabs[0]

  async function selectDirectory() {
    const dir = await window.primo.config.selectDirectory()
    if (dir) {
      $config = {
        ...$config,
        saveDir: dir,
      }
    }
  }
</script>

<main>
  <Tabs {tabs} bind:activeTab />
  <div class="content-container">
    {#if activeTab.label === 'Hosting'}
      <h1 class="primo-heading-lg">
        Hosting <span
          >Connect to your favorite webhost to publish your primo sites to the
          internet</span
        >
      </h1>
      <Hosting showDetails={false} />
    {:else if activeTab.label === 'Advanced'}
      <h1 class="primo-heading-lg">Advanced</h1>
      <div>
        <h2>Save directory</h2>
        <span>{$config.saveDir}</span>
        <PrimaryButton on:click={selectDirectory}
          >Select directory</PrimaryButton
        >
      </div>
    {/if}
  </div>
</main>

<style lang="postcss">
  h1 {
    display: flex;
    flex-direction: column;
    line-height: 1.4;
    margin-bottom: 1rem;

    span {
      font-weight: 500;
      font-size: 0.75rem;
      color: var(--color-gray-4);
    }
  }
  main {
    color: var(--color-gray-1);
    background: var(--color-gray-9);
    padding: 2rem;
    border: 2px solid var(--color-primored);
    border-radius: 0.25rem;
    width: 100vw;
    max-width: 600px;

    .content-container {
      margin-top: 1rem;
    }

    & > * {
      margin: 0.5rem 0;
    }

    hr {
      border-color: var(--color-gray-8);
      margin: 1.5rem 0;
    }

    --space-y: 1rem;
  }
</style>
