<script>
  import { find } from 'lodash'
  import Spinner from '$lib/ui/Spinner.svelte'
  // import { downloadPagePreview } from '../supabase/storage'
  import { buildStaticPage } from '@primo-app/primo/src/stores/helpers'

  export let site = null
  export let preview = null

  let container
  let scale
  let iframe
  let iframeLoaded

  function resizePreview() {
    const { clientWidth: parentWidth } = container
    const { clientWidth: childWidth } = iframe
    scale = parentWidth / childWidth
  }

  async function getPreview() {
    const homepage = find(site.pages, ['id', 'index'])
    preview = await buildStaticPage({
      page: homepage,
      site,
    })
  }
  if (!preview) {
    getPreview()
  }
</script>

<svelte:window on:resize={resizePreview} />

<div class="iframe-root">
  <div bind:this={container} class="iframe-container">
    {#if !iframeLoaded}
      <div class="spinner">
        <Spinner />
      </div>
    {/if}
    {#if preview}
      <iframe
        tabindex="-1"
        bind:this={iframe}
        style="transform: scale({scale})"
        class:fadein={iframeLoaded}
        title="page preview"
        srcdoc={preview}
        on:load={() => {
          resizePreview()
          iframeLoaded = true
        }}
      />
    {/if}
  </div>
</div>

<style>
  .iframe-root {
    pointer-events: none;
    overflow: hidden;
    position: relative;
    padding-top: var(--thumbnail-height, 75%);
  }
  .iframe-container {
    position: absolute;
    inset: 0;
    z-index: 10;
    background: transparent;
    opacity: 1;
    transition: opacity 0.1s;
    width: 100%;
    height: 100%;
    font-size: 0.75rem;
    line-height: 1rem;
    overflow: hidden;
    overflow-wrap: break-word;
  }
  iframe {
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.1s;
    background: var(--color-white);
    width: 100vw;
    will-change: opacity;
    transform-origin: top left;
    height: 1000vh;
  }
  .fadein {
    opacity: 1;
  }
  .spinner {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
