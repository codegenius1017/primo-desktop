<script>
  import axios from 'axios'
  import SiteThumbnail from '$lib/components/SiteThumbnail.svelte'
  import Spinner from '$lib/ui/Spinner.svelte'
  import TextField from '$lib/ui/TextField.svelte'
  import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
  import { makeValidUrl } from '$lib/utils'
  import sites from '../../../stores/sites'
  import { createSite } from '@primo-app/primo/src/const'
  import { buildStaticPage } from '@primo-app/primo/src/stores/helpers'

  export let onSuccess = (newSite) => {}
  let loading
  let siteName = ``
  let siteID = ``
  let existingRepo = ``
  let siteIDFocused = false
  let message = ''
  // $: siteURL = siteID
  $: canCreateSite = siteName && siteID

  let siteData

  async function createNewSite() {
    loading = true

    loading = false

    siteData = createSite({ id: siteID, name: siteName })

    onSuccess(siteData)
  }

  function validateUrl() {
    siteID = makeValidUrl(siteIDFocused ? siteID : siteName)
  }

  let themes = []

  let selectedTheme = { id: null }
  async function selectTheme(theme) {
    // selectedTheme = theme
    // const res = await downloadSiteData(theme)
    // const json = await res.data.text()
    // const themeData = JSON.parse(json)
    // data = {
    //   ...themeData,
    //   id: siteID,
    //   name: siteName,
    // }
  }

  let duplicatingSite = false
  function readJsonFile({ target }) {
    var reader = new window.FileReader()
    reader.onload = async function ({ target }) {
      if (typeof target.result !== 'string') return
      siteData = JSON.parse(target.result)
      duplicatingSite = true
    }
    reader.readAsText(target.files[0])
  }
</script>

<main class="primo-modal">
  {#if !loading}
    <h1 class="primo-heading-xl">Create a site</h1>
    <form on:submit|preventDefault={createNewSite}>
      <div class="name-url">
        <TextField
          autofocus={true}
          label="Site Name"
          on:input={validateUrl}
          bind:value={siteName}
        />
        <TextField
          label="Site URL"
          bind:value={siteID}
          on:input={validateUrl}
          on:focus={() => (siteIDFocused = true)}
        />
      </div>
      <!-- {#if duplicatingSite}
        <details open>
          <summary>Themes</summary>
          <ul>
            {#each themes as theme}
              <li>
                <button
                  class:selected={theme.id === selectedTheme.id ||
                    (!theme.id && !selectedTheme)}
                  on:click={() => selectTheme(theme)}
                  type="button"
                >
                  <span>{theme.name}</span>
                </button>
                <div class="thumbnail-container">
                  <SiteThumbnail site={theme} preview={theme.preview} />
                </div>
              </li>
            {/each}
          </ul>
        </details>
      {/if} -->
      <details id="advanced-options">
        <summary>Advanced options</summary>
        <div>
          <div class="file">
            <PrimaryButton type="input" on:change={readJsonFile}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Duplicate from primo.json</span>
            </PrimaryButton>
          </div>
          {#if duplicatingSite}
            <SiteThumbnail site={siteData} />
          {/if}
        </div>
      </details>
      <div class="submit">
        <PrimaryButton
          type="submit"
          label={existingRepo ? 'Clone site from repo' : 'Create site'}
          disabled={!canCreateSite}
        />
      </div>
    </form>
  {:else}
    <div class="creating-site">
      <span>Creating {siteName}</span>
      {#key message}
        <p>{message}</p>
      {/key}
      <Spinner />
    </div>
  {/if}
</main>

<style lang="postcss">
  .primo-modal {
    max-width: var(--primo-max-width-1);

    form {
      .name-url {
        /* & > * {
          margin-bottom: 0.5rem;
        } */
        margin-bottom: 1.5rem;
      }

      .submit {
        --color-link: var(--color-primored);
      }
    }

    details {
      margin-bottom: 1.5rem;

      summary {
        margin-bottom: 0.5rem;
        &:focus {
          outline: 0;
          cursor: pointer;
          font-size: var(--font-size-2);
        }
      }
    }
  }
  #advanced-options {
    margin-bottom: 1.5rem;

    .file {
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;

      svg {
        height: 1.25rem;
        width: 1.25rem;
        margin-right: 0.25rem;
      }
    }
  }

  .creating-site {
    display: flex;
    align-items: center;

    & > * {
      margin: 0 1rem;
    }
  }
</style>
